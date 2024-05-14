import fs from 'fs';
import path from 'path';

const __dirname = import.meta.dirname;

function getDirectories(srcpath) {
    let fullPath = path.join(__dirname, srcpath);
    return fs.readdirSync(fullPath).filter(function (file) {
        return fs.statSync(path.join(fullPath, file)).isDirectory();
    });
}

async function loadFiles(directory) {
    let fullPath = path.join(__dirname, directory);
    let files = fs.readdirSync(fullPath).filter((file) => {
        return !fs.statSync(path.join(fullPath, file)).isDirectory() && file.endsWith('.js');
    });

    for (let file of files) {
        let card = (await import('./' + directory + '/' + file)).default;

        cards[card.code] = card;
    }
}

async function loadCards(directory) {
    let cards = {};

    await loadFiles(directory);

    for (let dir of getDirectories(directory)) {
        cards = Object.assign(cards, await loadCards(path.join(directory, dir)));
    }

    return cards;
}

let cards = {};
let directories = getDirectories('.');

for (let directory of directories) {
    cards = Object.assign(cards, await loadCards(directory));
}

export default cards;
