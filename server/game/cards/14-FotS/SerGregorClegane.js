import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SerGregorClegane extends DrawCard {
    // Ser Gregor Clegane (14027)
    // Intimidate. Pillage.
    // Forced Reaction: After you win a challenge in which Ser Gregor Clegane is participating,
    // choose and kill a character you control.
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                afterChallenge: (event, context) =>
                    context.source.isParticipating() &&
                    event.challenge.isMatch({ winner: context.source.controller })
            },
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.controller === context.source.controller,
                gameAction: 'kill'
            },
            message: '{player} is forced to choose and kill {target} for {source}',
            gameAction: GameActions.kill((context) => ({ card: context.target }))
        });
    }
}

SerGregorClegane.code = '14027';

export default SerGregorClegane;
