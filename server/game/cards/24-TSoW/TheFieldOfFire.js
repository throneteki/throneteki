const DrawCard = require('../../drawcard.js');
const Message = require('../../Message');
const TextHelper = require('../../TextHelper');

class TheFieldOfFire extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            cost: ability.costs.payXGold(() => 1, () => this.game.getNumberOfCardsInPlay(card => card.isParticipating())),
            message: {
                format: '{player} plays {source} to choose {xValue} participating characters',
                args: { xValue: context => context.xValue }
            },
            handler: context => {
                let xValue = context.xValue;
                this.game.promptForSelect(this.controller, {
                    mode: 'exactly',
                    numCards: xValue,
                    activePromptTitle: `Select ${TextHelper.count(xValue, 'character')}`,
                    source: this,
                    cardCondition: card => card.location === 'play area' && card.getType() === 'character' && card.isParticipating(),
                    onSelect: (player, cards) => this.targetsSelected(player, cards)
                });
            }
        });
    }

    targetsSelected(player, cards) {
        let dragons = this.controller.getNumberOfCardsInPlay(card => card.hasTrait('Dragon'));
        let reduceOne = cards.filter(card => !(card.hasTrait('Army') && card.hasTrait('Commander')));
        let reduceThree = cards.filter(card => card.hasTrait('Army') || card.hasTrait('Commander'));
        let reductionMessages = [];
        if(reduceOne.length > 0) {
            this.untilEndOfPhase(ability => ({
                match: reduceOne,
                targetController: 'any',
                effect: ability.effects.modifyStrength(-dragons)
            }));
            reductionMessages.push(Message.fragment('{cards} by 1', { cards: reduceOne }));
        }
        if(reduceThree.length > 0) {
            this.untilEndOfPhase(ability => ({
                match: reduceThree,
                targetController: 'any',
                effect: ability.effects.modifyStrength(-dragons * 3)
            }));
            reductionMessages.push(Message.fragment('{cards} by 3', { cards: reduceThree }));
        }

        this.game.addMessage('{0} reduces the strength of {1} until the end of the phase', player, reductionMessages);

        return true;
    }
}

TheFieldOfFire.code = '24021';

module.exports = TheFieldOfFire;
