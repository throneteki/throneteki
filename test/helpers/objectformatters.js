/* global jasmine */
/* eslint camelcase: 0, no-invalid-this: 0 */

const BaseCard = require('../../server/game/basecard.js');
const Game = require('../../server/game/game.js');
const Player = require('../../server/game/player.js');

// Add custom toString methods for better Jasmine output
function formatObject(...keys) {
    return function() {
        let properties = Object.entries(this).filter(pair => keys.includes(pair[0]));
        let formattedProperties = properties.map(([key, value]) => key + ': ' + jasmine.pp(value));
        return this.constructor.name + '({ ' + formattedProperties.join(', ') + ' })';
    };
}

BaseCard.prototype.toString = formatObject('name', 'location');
Player.prototype.toString = formatObject('name');

Game.prototype.toString = function() {
    return 'Game';
};
