import DrawCard from '../../drawcard.js';

class QuentynMartell extends DrawCard {
    // Quentyn Martell (10011)
    // Renown.
    // Forced Reaction: After the challenges phase begins, if there are fewer than 3 plot cards in
    // your used pile, kneel Quentyn Martell.
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                onPhaseStarted: (event) =>
                    event.phase === 'challenge' && this.controller.getNumberOfUsedPlots() < 3
            },
            handler: (context) => {
                context.player.kneelCard(this);
                this.game.addMessage('{0} is forced to kneel {1}', context.player, this);
            }
        });
    }
}

QuentynMartell.code = '10011';

export default QuentynMartell;
