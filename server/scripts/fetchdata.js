/*eslint no-console:0 */
const commandLineArgs = require('command-line-args');
const monk = require('monk');
const path = require('path');

const CardImport = require('./fetchdata/CardImport.js');
const CardgameDbImageSource = require('./fetchdata/CardgameDbImageSource.js');
const JsonCardSource = require('./fetchdata/JsonCardSource.js');
const NoImageSource = require('./fetchdata/NoImageSource.js');
const ThronesDbApiCardSource = require('./fetchdata/ThronesDbApiCardSource.js');

const optionsDefinition = [
    { name: 'card-source', type: String, defaultValue: 'thronesdb' },
    { name: 'image-source', type: String, defaultValue: 'cardgamedb' },
    { name: 'image-dir', type: String, defaultValue: path.join(__dirname, '..', '..', 'public', 'img', 'cards') },
    { name: 'no-images', type: Boolean, defaultValue: false }
];

function createDataSource(options) {
    switch(options['card-source']) {
        case 'thronesdb':
            return new ThronesDbApiCardSource();
        case 'json':
            return new JsonCardSource();
    }

    throw new Error(`Unknown card source '${options['card-source']}'`);
}

function createImageSource(options) {
    if(options['no-images']) {
        return new NoImageSource();
    }

    switch(options['image-source']) {
        case 'none':
            return new NoImageSource();
        case 'cardgamedb':
            return new CardgameDbImageSource();
    }

    throw new Error(`Unknown image source '${options['image-source']}'`);
}

let options = commandLineArgs(optionsDefinition);

let db = monk('mongodb://127.0.0.1:27017/throneteki');
let dataSource = createDataSource(options);
let imageSource = createImageSource(options);
let cardImport = new CardImport(db, dataSource, imageSource, options['image-dir']);

cardImport.import();

