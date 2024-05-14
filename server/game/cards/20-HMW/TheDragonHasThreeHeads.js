const DrawCard = require('../../drawcard.js');

class TheDragonHasThreeHeads extends DrawCard {
    setupCardAbilities() {
        this.action({
            handler: (context) => {
                let bonusMessage = [];

                if (context.player.cardsInPlay.find((card) => card.name === 'Drogon')) {
                    this.untilEndOfPhase((ability) => ({
                        match: (card) => card.hasTrait('Dragon') && card.getType() === 'character',
                        effect: ability.effects.addKeyword('intimidate')
                    }));
                    bonusMessage.push('intimidate');
                }

                if (context.player.cardsInPlay.find((card) => card.name === 'Rhaegal')) {
                    this.untilEndOfPhase((ability) => ({
                        match: (card) => card.hasTrait('Dragon') && card.getType() === 'character',
                        effect: ability.effects.addKeyword('renown')
                    }));
                    bonusMessage.push('renown');
                }

                if (context.player.cardsInPlay.find((card) => card.name === 'Viserion')) {
                    this.untilEndOfPhase((ability) => ({
                        match: (card) => card.hasTrait('Dragon') && card.getType() === 'character',
                        effect: ability.effects.addKeyword('stealth')
                    }));
                    bonusMessage.push('stealth');
                }

                this.game.addMessage(
                    '{0} plays {1} to have each Dragon character they control gain {2} until the end of the phase',
                    context.player,
                    this,
                    bonusMessage
                );
            }
        });
    }
}

TheDragonHasThreeHeads.code = '20034';

module.exports = TheDragonHasThreeHeads;
