import DrawCard from '../../drawcard.js';

class Polliver extends DrawCard {
    // Polliver (06029)
    // Pillage.
    // Reaction: After Polliver discards a character using pillage, return 2 gold from the losing
    // opponent's gold pool to the treasury.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardDiscarded: (event) =>
                    event.isPillage &&
                    event.source === this &&
                    event.card.getType() === 'character' &&
                    event.card.owner.gold >= 1
            },
            handler: (context) => {
                let otherPlayer = context.event.card.owner;
                this.game.returnGoldToTreasury({ player: otherPlayer, amount: 2 });
                this.game.addMessage(
                    '{0} uses {1} to have {2} return 2 gold to the treasury',
                    this.controller,
                    this,
                    otherPlayer
                );
            }
        });
    }
}

Polliver.code = '06029';

export default Polliver;
