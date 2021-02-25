const xmldom = require('xmldom');
const amdextract = require('amdextract')

let getRedundantXMLLibs = (file_content, file_path) => {
    let doc = new xmldom.DOMParser().parseFromString(file_content);
    const oAttributes = doc.documentElement.attributes
    let aReduntantLibs = []

    Array.from(oAttributes).filter(el => el.nodeName.startsWith("xmlns:")).forEach(x => {
        if (doc.getElementsByTagNameNS(x.nodeValue,'*').length === 0) {
            aReduntantLibs.push({
            lib: x.nodeValue,
            path: file_path
        })
        }
    })

    return aReduntantLibs
}

let getRedundantJSLibs = (file_content, file_path) => {
    let sModContent = file_content.replace("sap.ui.define", "define") // Need to find a way to make esprima sap.ui.define aware
    let amd = amdextract.parse(sModContent)
    let aReduntantLibs = []

    amd.results.filter(x => x.unusedPaths.length > 0).forEach(module => {
        module.unusedPaths.forEach(lib => {
            aReduntantLibs.push({
                lib: lib,
                path: file_path
            })
        })
    });

    return aReduntantLibs
}

module.exports.getRedundantXMLLibs = getRedundantXMLLibs
module.exports.getRedundantJSLibs = getRedundantJSLibs
