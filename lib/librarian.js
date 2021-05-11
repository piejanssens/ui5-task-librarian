const utils = require("./utils");
const log = require("@ui5/logger").getLogger("builder:customtask:librarian")

module.exports = async function ({ workspace, dependencies, options }) {

    let aFiles
    try {
        aFiles = await workspace.byGlob(['**/*.js', '**/*.view.xml'])
    } catch (e) {
        log.error(`📚 Couldn't read files: ${e}`)
    }

    let aLibraryTasksP = []
    for (let resource of aFiles) {
        let asyncWorkForContent = async () => {
            options.configuration && options.configuration.debug && log.info(`📚 Reading file: ${resource.getPath()} .`)
            let fileContent = await resource.getString()
            let sExt = resource.getPath().substr(resource.getPath().lastIndexOf('.') + 1).toLowerCase()
            if (sExt === 'xml') {
                if (options.configuration.listusedlibs) return utils.getUsedXMLLibs(fileContent, resource.getPath())
                return utils.getRedundantXMLLibs(fileContent, resource.getPath())
            } else if (sExt === 'js') {
                if (options.configuration.listusedlibs) return utils.getUsedJSLibs(fileContent, resource.getPath())
                return utils.getRedundantJSLibs(fileContent, resource.getPath())
            }
        }
        aLibraryTasksP.push(asyncWorkForContent())
    }

    let aLibsResults
    try {
        aLibsResults = await Promise.all(aLibraryTasksP)
    } catch (e) {
        log.error(`📚 Uh Oh: ${e.stack}`)
    }

    let aLibs = Array.prototype.concat.apply([], aLibsResults)
    aLibs.forEach((redundancy) => {
        if (redundancy.lib.match(/^sap[.\/]/) ) {
            if (options.configuration.listusedlibs) log.info(`📚 UI5 Library used: ${redundancy.lib} at ${redundancy.path}`)
            else log.warn(`📚 Unused UI5 library ${redundancy.lib} at ${redundancy.path}`)
        }
        else {
            if (options.configuration.listusedlibs) log.info(`📚 External library or resource used: ${redundancy.lib} at ${redundancy.path}`)
            else log.info(`📚 Unused library or resource ${redundancy.lib} at ${redundancy.path}`)
        }
    })

    if(options.configuration && options.configuration.strict && aLibs.length > 0) {
        log.error(`📚 The librarian is configured to be strict, please remove redundancies and rebuild.`)
        process.exit(1)
    }

}
