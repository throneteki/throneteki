import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SerJasonMallister extends DrawCard {
    // Ser Jason Mallister (11101)
    // While there are no cards in shadows, Ser Jason Mallister gains renown.
    // Reaction: After you win a challenge in which Ser Jason Mallister is attacking, choose a card
    // in shadows controlled by the losing opponent, and discard it.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) =>
                context.game.getPlayers().every((player) => player.shadows.length === 0),
            match: (card, context) => card === context.source,
            effect: ability.effects.addKeyword('Renown')
        });

        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.player && context.source.isAttacking()
            },
            target: {
                activePromptTitle: 'Select a card in shadows',
                cardCondition: (card, context) =>
                    card.location === 'shadows' &&
                    card.controller === context.event.challenge.loser,
                gameAction: 'discard'
            },
            message: '{player} uses {source} to discard {target} from shadows',
            gameAction: GameActions.discardCard((context) => ({ card: context.target }))
        });
    }
}

SerJasonMallister.code = '11101';

export default SerJasonMallister;
