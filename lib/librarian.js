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
                return utils.getRedundantXMLLibs(fileContent, resource.getPath())
            } else if (sExt === 'js') {
                return utils.getRedundantJSLibs(fileContent, resource.getPath())
            }
        }
        aLibraryTasksP.push(asyncWorkForContent())
    }

    let aRedundantLibsResults
    try {
        aRedundantLibsResults = await Promise.all(aLibraryTasksP)
    } catch (e) {
        log.error(`📚 Uh Oh: ${e.stack}`)
    }

    let aRedundantLibs = Array.prototype.concat.apply([], aRedundantLibsResults)
    aRedundantLibs.forEach((redundancy) => {
        if (redundancy.lib.match(/^sap[.\/]/) ) {
            log.warn(`📚 Unused UI5 library ${redundancy.lib} at ${redundancy.path}`)
        }
        else {
            log.info(`📚 Unused library or resource ${redundancy.lib} at ${redundancy.path}`)
        }
    })

    if(options.configuration && options.configuration.strict && aRedundantLibs.length > 0) {
        log.error(`📚 The librarian is configured to be strict, please remove redundancies and rebuild.`)
        process.exit(1)
    }

}
