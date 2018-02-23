// french spoiler image:
// https://i.redditmedia.com/SxCGctsBb71h87NWgeUy8uFPE0JKbC_U2rPjGr-N2vg.jpg?w=500&s=e8cdc218e218f28254767e63c69aba20
//
// TODO: implement immunity to strength reduction
//
// Effects that should check new immunity:
//
// - modifyStrength
// - modifyStrengthMultiplier
//
// Effects that should be OK as is:
//
// - killByStrength (use ModifyStrength)
// - dynamicStrength (use modifyStrength)

const DrawCard = require('../../drawcard.js');

class DaenerysTargaryen extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlayed: event => event.card.controller === this.controller && event.card.isFaction('targaryen')
            },
            limit: ability.limit.perRound(3),
            target: {
                cardCondition: card => card.location === 'play area' && card.getType() === 'character'
            },
            effect: ability.effects.killByStrength(-1)
        });
    }
}

DaenerysTargaryen.code = '08093';

module.exports = DaenerysTargaryen;
