import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

function controlsFewerCharacters(source) {
    return (
        source.controller.getNumberOfCardsInPlay({ type: 'character' }) <
        source.game.currentChallenge.attackingPlayer.getNumberOfCardsInPlay({
            type: 'character'
        })
    );
}

class Retribution extends DrawCard {
    // Retribution (26048)
    // Reaction: After a character you control is killed for [military] claim, if you control fewer
    // characters than the attacking player, that player must choose and kill an attacking
    // character.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCharacterKilled: (event, context) =>
                    event.card.controller === context.source.controller &&
                    event.isClaim &&
                    !!context.game.currentChallenge &&
                    controlsFewerCharacters(context.source)
            },
            target: {
                choosingPlayer: (player, context) =>
                    player === context.game.currentChallenge.attackingPlayer,
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.isAttacking() &&
                    GameActions.kill({ card }).allow()
            },
            message: {
                format: '{player} plays {source} to have {controller} choose and kill {target}',
                args: { controller: (context) => context.target.controller }
            },
            gameAction: GameActions.kill((context) => ({ card: context.target }))
        });
    }
}

Retribution.code = '26048';

export default Retribution;
