/*eslint no-console:0 */
const monk = require('monk');
const fs = require('fs');
const _ = require('underscore');

const CardService = require('./services/CardService.js');

let db = monk('mongodb://127.0.0.1:27017/throneteki');
let cardService = new CardService(db);
let files = fs.readdirSync('thronesdb-json-data/pack');
let totalCards = [];
let packs = JSON.parse(fs.readFileSync('thronesdb-json-data/packs.json'));
let types = JSON.parse(fs.readFileSync('thronesdb-json-data/types.json'));
let factions = JSON.parse(fs.readFileSync('thronesdb-json-data/factions.json'));

_.each(files, file => {
    let cards = JSON.parse(fs.readFileSync('thronesdb-json-data/pack/' + file));

    totalCards = totalCards.concat(cards);
});

_.each(totalCards, card => {
    let cardsByName = _.filter(totalCards, filterCard => {
        return filterCard.name === card.name;
    });

    if(cardsByName.length > 1) {
        card.label = card.name + ' (' + card.pack_code + ')';
    } else {
        card.label = card.name;
    }

    let faction = _.find(factions, faction => {
        return faction.code === card.faction_code;
    });

    let type = _.find(types, type => {
        return type.code === card.type_code;
    });

    if(faction) {
        card.faction_name = faction.name;
    } else {
        console.info(faction, card.faction_code);
    }

    if(type) {
        card.type_name = type.name;
    } else {
        console.info(card.type_code);
    }
});

let replacePacks = cardService.replacePacks(packs)
    .then(packs => {
        console.info(packs.length + ' packs imported');
    });

let replaceCards = cardService.replaceCards(totalCards)
    .then(cards => {
        console.info(cards.length + ' cards imported');
    });

Promise.all([replacePacks, replaceCards])
    .then(() => db.close())
    .catch(() => db.close());
