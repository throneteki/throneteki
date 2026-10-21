import DrawCard from '../../drawcard.js';

class TandaStokeworth extends DrawCard {
    // Tanda Stokeworth (04069)
    // Reaction: After you marshal Tanda Stokeworth, each player gains 3 gold.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this && event.playingType === 'marshal'
            },
            handler: () => {
                for (let player of this.game.getPlayers()) {
                    this.game.addGold(player, 3);
                }

                this.game.addMessage(
                    '{0} uses {1} to have each player gain 3 gold',
                    this.controller,
                    this
                );
            }
        });
    }
}

TandaStokeworth.code = '04069';

export default TandaStokeworth;
