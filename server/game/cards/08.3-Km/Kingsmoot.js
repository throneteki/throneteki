import DrawCard from '../../drawcard.js';

class Kingsmoot extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            max: ability.limit.perRound(1),
            when: {
                onDominanceDetermined: (event) => this.controller === event.winner
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.controller === this.controller &&
                    card.isUnique() &&
                    card.isFaction('greyjoy') &&
                    card.getType() === 'character',
                gameAction: 'gainPower'
            },
            handler: (context) => {
                let amount = context.player.getNumberOfCardsInPlay(
                    (card) =>
                        card.isUnique() &&
                        card.isFaction('greyjoy') &&
                        card.getType() === 'character'
                );
                context.target.modifyPower(amount);
                this.game.addMessage(
                    '{0} plays {1} to have {2} gain {3} power',
                    context.player,
                    this,
                    context.target,
                    amount
                );
            }
        });
    }
}

Kingsmoot.code = '08052';

export default Kingsmoot;
