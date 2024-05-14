import DrawCard from '../../drawcard.js';

class SerIlynPayne extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kill a character',
            phase: 'marshal',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.getPrintedCost() <= 3,
                gameAction: 'kill'
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} kneels {1} to kill {2}',
                    this.controller,
                    this,
                    context.target
                );

                this.game.killCharacter(context.target);
            }
        });
    }
}

SerIlynPayne.code = '02109';

export default SerIlynPayne;
