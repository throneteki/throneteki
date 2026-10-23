import GameActions from '../../GameActions/index.js';
import PlotCard from '../../plotcard.js';

class EnemiesInEveryShadow extends PlotCard {
    // Enemies in Every Shadow (25099)
    // While there are no cards in shadows, each character you control gets +1 STR.
    // Reaction: After you win a challenge, choose a card in shadows controlled by the losing
    // opponent, and discard it. If that card is a character, place it in its owner's dead pile.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) =>
                context.game.allCards.every((card) => card.location !== 'shadows'),
            match: (card) => card.getType() === 'character',
            targetController: 'current',
            effect: ability.effects.modifyStrength(1)
        });
        this.reaction({
            when: { afterChallenge: (event, context) => event.challenge.winner === context.player },
            target: {
                cardCondition: (card, context) =>
                    card.location === 'shadows' && card.controller === context.event.challenge.loser
            },
            message: '{player} uses {source} to discard {target} from shadows',
            gameAction: GameActions.discardCard((context) => ({
                card: context.target,
                destination: context.target.getType() === 'character' ? 'dead pile' : 'discard pile'
            }))
        });
    }
}

EnemiesInEveryShadow.code = '25099';

export default EnemiesInEveryShadow;
