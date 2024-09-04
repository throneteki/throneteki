import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class TheKnight extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Raise claim',
            limit: ability.limit.perChallenge(1),
            condition: () => this.game.isDuringChallenge({ attackingPlayer: this.controller }),
            target: {
                activePromptTitle: 'Select 2 characters',
                type: 'select',
                mode: 'exactly',
                numCards: 2,
                cardCondition: {
                    type: 'character',
                    location: 'discard pile',
                    condition: (card) =>
                        card.controller === this.game.currentChallenge.defendingPlayer
                }
            },
            message: {
                format: "{player} uses {source} to return {target} to {defendingPlayer}'s hand",
                args: { defendingPlayer: () => this.game.currentChallenge.defendingPlayer }
            },
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.simultaneously((context) =>
                        context.target.map((card) =>
                            GameActions.placeCard({ card, location: 'hand' })
                        )
                    ).then({
                        message:
                            'Then, {player} raises the claim on their revealed plot card by 1 until the end of the challenge',
                        handler: () => {
                            this.untilEndOfChallenge((ability) => ({
                                match: (card) => card === this.controller.activePlot,
                                effect: ability.effects.modifyClaim(1)
                            }));
                        }
                    }),
                    context
                );
            }
        });
    }
}

TheKnight.code = '25083';

export default TheKnight;
