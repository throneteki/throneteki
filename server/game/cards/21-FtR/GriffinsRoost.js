const DrawCard = require('../../drawcard');
const GenericTracker = require('../../EventTrackers/GenericTracker');
const {Tokens} = require('../../Constants');

class GriffinsRoost extends DrawCard {
    setupCardAbilities(ability) {
        this.tracker = GenericTracker.forPhase(this.game, 'onCardOutOfShadows');

        this.persistentEffect({
            match: card => card.name === 'Jon Connington',
            effect: ability.effects.addIcon('power')
        });
      
        this.reaction({
            when: {
                afterChallenge: (event, context) => event.challenge.isMatch({ winner: context.player, challengeType: 'power' })
            },
            cost: ability.costs.kneelFactionCard(),
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: (card, context) => card.location === 'hand' && card.controller === context.player,
                // Even though the card text uses the word 'choose', use a non
                // targeting prompt to prevent the card from being revealed
                // when the opponent is prompted to cancel the ability.
                type: 'select'
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to put a card into shadow', context.player, this);
                context.player.putIntoShadows(context.target, false, () => {
                    context.target.modifyToken(Tokens.shadow, 1);

                    if(!context.target.isShadow()) {
                        this.lastingEffect(ability => ({
                            condition: () => context.target.location === 'shadows',
                            targetLocation: 'any',
                            match: context.target,
                            effect: ability.effects.addKeyword(`Shadow (${context.target.getPrintedCost()})`)
                        }));
                    }
                });
            }
        });
    }
}

GriffinsRoost.code = '21021';

module.exports = GriffinsRoost;
