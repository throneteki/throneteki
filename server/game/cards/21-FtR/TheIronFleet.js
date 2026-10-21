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
                    this.hasAttackingRaider(context.player)
            },
            message: "{player} uses {source} to discard the top card from each opponent's deck",
            gameAction: GameActions.simultaneously((context) =>
                this.game.getOpponents(context.player).map((opponent) =>
                    GameActions.discardTopCards({
                        player: opponent,
                        amount: 1,
                        source: context.source
                    }).thenExecute((event) => {
                        this.game.addMessage('{player} discards {topCards}', event);
                    })
                )
            )
        });
    }

    hasAttackingRaider(player) {
        return player.anyCardsInPlay(
            (card) =>
                card.isAttacking() && card.hasTrait('Raider') && card.getType() === 'character'
        );
    }
}

TheIronFleet.code = '21004';

export default TheIronFleet;
