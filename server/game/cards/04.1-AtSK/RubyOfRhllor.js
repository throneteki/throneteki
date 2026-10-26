import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class RubyOfRhllor extends DrawCard {
    // Ruby of R'hllor (04009)
    // R'hllor character only.
    // Reaction: After you win an [intrigue] challenge in which attached character is attacking,
    // name a card. The losing opponent reveals his or her hand and discards each card with that
    // name.
    setupCardAbilities() {
        this.attachmentRestriction({ trait: "R'hllor" });
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.challengeType === 'intrigue' &&
                    event.challenge.winner === context.player &&
                    !!context.source.parent &&
                    event.challenge.isAttacking(context.source.parent)
            },
            gameAction: GameActions.nameCard({
                message: {
                    format: '{player} uses {source} to name {cardName} and have {loser} reveal their hand and discard each card with that name',
                    args: { loser: (context) => context.event.challenge.loser }
                },
                gameAction: GameActions.revealCards((context) => ({
                    cards: [...context.event.challenge.loser.hand],
                    player: context.event.challenge.loser,
                    whileRevealed: GameActions.simultaneously((context) =>
                        context.revealed
                            .filter(
                                (card) =>
                                    card.location === 'hand' && card.name === context.namedCard
                            )
                            .map((card) => GameActions.discardCard({ card }))
                    )
                }))
            })
        });
    }
}

RubyOfRhllor.code = '04009';

export default RubyOfRhllor;
