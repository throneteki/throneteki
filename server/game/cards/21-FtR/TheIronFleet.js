import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheIronFleet extends DrawCard {
    // The Iron Fleet (21004)
    // Assault. No attachments. Pillage.
    // Reduce the cost of each Raider character you marshal by 1.
    // Reaction: After you initiate a challenge in which you control an attacking Raider character,
    // discard the top card of each opponent's deck.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.reduceCost({
                playingTypes: 'marshal',
                amount: 1,
                match: (card) => card.hasTrait('Raider')
            })
        });
        this.reaction({
            when: {
                onChallengeInitiated: (event, context) =>
                    event.challenge.attackingPlayer === context.player &&
                    context.player.anyCardsInPlay(
                        (card) =>
                            card.isAttacking() &&
                            card.hasTrait('Raider') &&
                            card.getType() === 'character'
                    )
            },
            message: "{player} uses {source} to discard the top card from each opponent's deck",
            gameAction: GameActions.simultaneously((context) =>
                context.game.getOpponents(context.player).map((opponent) =>
                    GameActions.discardTopCards({
                        player: opponent,
                        amount: 1,
                        source: context.source
                    })
                )
            )
        });
    }
}

TheIronFleet.code = '21004';

export default TheIronFleet;
