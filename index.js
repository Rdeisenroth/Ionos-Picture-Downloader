var axios = require('axios');
var fs = require('fs');
var path = require('path');
/**
 * @typedef {{id:string,name:string}} ImageFolder
 */
/**
 * @typedef {{id:string,uuid:string,folderId:number|null,publicName:string,thumb:string,preview:string,file:string}} ImageFile
 */

var config = {
    method: 'get',
    url: 'censored',
    headers: {
        'Connection': 'keep-alive',
        'Accept': 'application/json, text/plain, */*',
        'X-DiyCSRFToken': 'censored',
        'X-Requested-With': 'XMLHttpRequest',
        'sec-ch-ua-platform': '"Android"',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Dest': 'empty',
        'Referer': 'censored',
        'Accept-Language': 'de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7',
        'Cookie': 'censored'
    }
};

/**
 * 
 * @returns {Promise<ImageFolder[]>}
 */
async function getFolders() {
    config.url = 'https://118.sb.mywebsite-editor.com/rest/websites/censored/storage-folders';
    return (await axios(config)).data;
}

/**
 * 
 * @returns {Promise<ImageFile[]>}
 */
async function getImages() {
    config.url = 'https://118.sb.mywebsite-editor.com/rest/websites/censored/storage-files';
    return (await axios(config)).data;
}

/**
 * 
 * @param {string} folderName
 */
function createFolder(folderName) {
    let newPathString = path.join(process.cwd(), "images", folderName);
    if (!fs.existsSync(newPathString)) {
        fs.mkdirSync(newPathString, { recursive: true });
    }
}

/**
 * 
 * @param {ImageFolder[]} folders 
 */
function createFolders(folders) {
    folders.forEach(f => {
        createFolder(f.name);
    })
    createFolder("unsorted");
}

/**
 * 
 * @param {string} url 
 * @param {string} fileName 
 */
async function downloadImage(url, fileName) {
    let newPathString = path.join(process.cwd(), "images", fileName);
    const writer = fs.createWriteStream(newPathString);
    let myCfg = config;
    myCfg.url = 'https://118.sb.mywebsite-editor.com/' + url;
    myCfg.responseType = 'stream';
    const response = await axios(config);
    response.data.pipe(writer)

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve)
        writer.on('error', reject)
    })
}

/**
 * 
 * @param {ImageFile[]} images 
 * @param {ImageFolder[]} folders
 */
async function downloadImages(images, folders) {
    images.forEach(async (i, index, imgs) => {
        let newFileName = (i.folderId && folders.find(x => "" + x.id === "" + i.folderId) ? folders.find(x => "" + x.id === "" + i.folderId)?.name + "/" : "unsorted/") + i.publicName;
        console.log(`downloading (${index + 1}/${imgs.length}): "${i.file}" to "${newFileName}"...`);
        var startTime = performance.now();
        await downloadImage(i.file, newFileName);
        var endTime = performance.now();
        console.log(`DONE (took ${Math.ceil(endTime - startTime)} ms)\n`);
    })
}

async function main() {
    let folders = await getFolders();
    createFolders(folders);
    let images = await getImages();
    downloadImages(images, folders);
}

main();