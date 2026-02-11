import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class BaelorBrightsmile extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    event.challenge.strengthDifference >= 5 &&
                    this.isParticipating()
            },
            message: '{player} uses {source} to reveal the top card of their deck',
            gameAction: GameActions.revealTopCards((context) => ({
                player: context.player
            })).then({
                condition: (context) => context.parentContext.revealed.length > 0,
                gameAction: GameActions.may({
                    title: (context) =>
                        `Place ${context.parentContext.revealed[0].name} as duplicate?`,
                    message: {
                        format: '{player} places {revealed} under {source} as a duplicate',
                        args: { revealed: (context) => context.parentContext.revealed[0] }
                    },
                    gameAction: GameActions.genericHandler((context) => {
                        const dupe = context.parentContext.revealed[0];
                        this.controller.removeCardFromPile(dupe);
                        this.addDuplicate(dupe);
                        dupe.facedown = true;
                    })
                })
            })
        });
    }
}

BaelorBrightsmile.code = '26095';

export default BaelorBrightsmile;
