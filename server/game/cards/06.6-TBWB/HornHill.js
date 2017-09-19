const _ = require('underscore');

const DrawCard = require('../../drawcard.js');

class HornHill extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give participating characters +STR',
            phase: 'challenge',
            condition: () => this.game.currentChallenge && this.hasToken('gold'),
            cost: ability.costs.kneelSelf(),
            handler: context => {
                let challenge = this.game.currentChallenge;
                let cards = _.filter(challenge.attackers.concat(challenge.defenders), card => card.controller === this.controller && card.isFaction('tyrell'));

                this.untilEndOfChallenge(ability => ({
                    match: card => cards.includes(card),
                    effect: ability.effects.modifyStrength(this.tokens['gold'])
                }));

                this.game.addMessage('{0} kneels {1} to give {2} +{3} STR until the end of the challenge',
                    context.player, this, cards, this.tokens['gold']);
            }
        });
    }
}

HornHill.code = '06104';

module.exports = HornHill;
