import DrawCard from '../../drawcard.js';

class SerIlynPayne extends DrawCard {
    // Ser Ilyn Payne (02109)
    // Marshaling Action: Kneel Ser Ilyn Payne to choose and kill a character with printed cost 3 or
    // lower.
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
