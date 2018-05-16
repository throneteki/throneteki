/*eslint no-console:0 */
const request = require('request');
const fs = require('fs');

function writeFile (path, data, opts = 'utf8') {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, data, opts, (err) => {
            if(err) {
                return reject(err);
            }

            resolve();
        });
    });
}

function fetchFile(url, options = {}) {
    return new Promise((resolve, reject) => {
        request(url, options, (err, res, body) => {
            if(err) {
                return reject(err);
            }

            resolve(body);
        });
    });
}

async function fetchClient() {
    console.info('Fetching vendor file information...');
    let vendorAssets = await fetchFile('https://theironthrone.net/vendor-assets.json', { json: true });
    await writeFile('./vendor-assets.json', JSON.stringify(vendorAssets));

    console.info('Fetching vendor javascript files...');
    let vendorJs = await fetchFile(`https://theironthrone.net${vendorAssets.vendor.js}`);
    await writeFile(`./public/${vendorAssets.vendor.js}`, vendorJs);
    let vendorMap = await fetchFile(`https://theironthrone.net${vendorAssets.vendor.js}.map`);
    await writeFile(`./public/${vendorAssets.vendor.js}.map`, vendorMap);

    console.info('Fetching bundle information...');
    let assets = await fetchFile('https://theironthrone.net/assets.json', { json: true });
    await writeFile('./assets.json', JSON.stringify(assets));

    console.info('Fetching main bundle files...');
    let js = await fetchFile(`https://theironthrone.net${assets.bundle.js}`);
    await writeFile(`./public/${assets.bundle.js}`, js);
    let css = await fetchFile(`https://theironthrone.net${assets.bundle.css}`);
    await writeFile(`./public/${assets.bundle.css}`, css);
    let map = await fetchFile(`https://theironthrone.net${assets.bundle.js}.map`);
    await writeFile(`./public/${assets.bundle.js}.map`, map);

    console.info('Done!');
}

(async() => {
    await fetchClient();
})();
