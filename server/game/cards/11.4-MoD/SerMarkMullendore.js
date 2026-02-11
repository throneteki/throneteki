import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SerMarkMullendore extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    event.challenge.isParticipating(this)
            },
            message: '{player} uses {source} to reveal the top card of their deck',
            gameAction: GameActions.revealTopCards((context) => ({
                player: context.player
            })).then({
                condition: (context) => context.parentContext.revealed.length > 0,
                gameAction: GameActions.may({
                    title: (context) => `Put ${context.parentContext.revealed[0].name} into play?`,
                    message: {
                        format: '{player} puts {revealed} into play and places {source} on top of their deck',
                        args: { revealed: (context) => context.parentContext.revealed[0] }
                    },
                    gameAction: GameActions.putIntoPlay((context) => ({
                        player: context.player,
                        card: context.parentContext.revealed[0],
                        dupeIsValid: true
                    })).then({
                        gameAction: GameActions.returnCardToDeck((context) => ({
                            allowSave: false,
                            card: context.source
                        }))
                    })
                })
            })
        });
    }
}

SerMarkMullendore.code = '11063';

export default SerMarkMullendore;
