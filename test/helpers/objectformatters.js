/* global jasmine */
/* eslint camelcase: 0, no-invalid-this: 0 */

import BaseCard from '../../server/game/basecard.js';

import Game from '../../server/game/game.js';
import Player from '../../server/game/player.js';

// Add custom toString methods for better Jasmine output
function formatObject(...keys) {
    return function (pp) {
        let properties = Object.entries(this).filter((pair) => keys.includes(pair[0]));
        let formattedProperties = properties.map(([key, value]) => key + ': ' + pp(value));
        return this.constructor.name + '({ ' + formattedProperties.join(', ') + ' })';
    };
}

BaseCard.prototype.jasmineToString = formatObject('name', 'location');
Player.prototype.jasmineToString = formatObject('name');

Game.prototype.toString = function () {
    return 'Game';
};
