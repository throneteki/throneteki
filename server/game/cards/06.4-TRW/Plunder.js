import DrawCard from '../../drawcard.js';

class Plunder extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Gain gold',
            condition: () => this.controller.canGainGold(),
            cost: ability.costs.kneelFactionCard(),
            chooseOpponent: (opponent) => this.getGold(opponent) >= 1,
            handler: (context) => {
                let gold = this.getGold(context.opponent);
                gold = this.game.addGold(this.controller, gold);

                this.game.addMessage(
                    '{0} uses {1} and kneels their faction card to choose {2} and gain {3} gold',
                    this.controller,
                    this,
                    context.opponent,
                    gold
                );
            }
        });
    }

    getGold(opponent) {
        return opponent.discardPile.reduce((num, card) => {
            if (
                card.location === 'discard pile' &&
                (card.getType() === 'location' || card.getType() === 'attachment')
            ) {
                return num + 1;
            }

            return num;
        }, 0);
    }
}

Plunder.code = '06072';

export default Plunder;
