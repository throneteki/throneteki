/*eslint no-console:0 */
import commandLineArgs from 'command-line-args';

import monk from 'monk';
import path from 'path';
import ServiceFactory from '../services/ServiceFactory.js';
import CardImport from './fetchdata/CardImport.js';
import CardgameDbImageSource from './fetchdata/CardgameDbImageSource.js';
import JsonCardSource from './fetchdata/JsonCardSource.js';
import NoImageSource from './fetchdata/NoImageSource.js';

const __dirname = import.meta.dirname;

const optionsDefinition = [
    { name: 'card-source', type: String, defaultValue: 'json' },
    {
        name: 'card-dir',
        type: String,
        defaultValue: path.join(__dirname, '..', '..', 'throneteki-json-data')
    },
    { name: 'image-source', type: String, defaultValue: 'cardgamedb' },
    {
        name: 'image-dir',
        type: String,
        defaultValue: path.join(__dirname, '..', '..', 'public', 'img', 'cards')
    },
    { name: 'no-images', type: Boolean, defaultValue: false }
];

function createDataSource(options) {
    switch (options['card-source']) {
        case 'json':
            return new JsonCardSource(options['card-dir']);
    }

    throw new Error(`Unknown card source '${options['card-source']}'`);
}

function createImageSource(options) {
    if (options['no-images']) {
        return new NoImageSource();
    }

    switch (options['image-source']) {
        case 'none':
            return new NoImageSource();
        case 'cardgamedb':
            return new CardgameDbImageSource();
    }

    throw new Error(`Unknown image source '${options['image-source']}'`);
}

let options = commandLineArgs(optionsDefinition);

let configService = ServiceFactory.configService();
let db = monk(configService.getValue('dbPath'));
let dataSource = createDataSource(options);
let imageSource = createImageSource(options);
let cardImport = new CardImport(db, dataSource, imageSource, options['image-dir']);

cardImport.import();
