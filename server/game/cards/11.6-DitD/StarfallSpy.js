import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class StarfallSpy extends DrawCard {
    // Starfall Spy (11115)
    // Shadow (3).
    // Reaction: After you win a challenge in which Starfall Spy is participating, return it to
    // shadows to choose another card you control in shadows and put it into play.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    context.source.isParticipating()
            },
            cost: ability.costs.putSelfIntoShadows(),
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: (card, context) =>
                    card.controller === context.source.controller &&
                    card !== context.source &&
                    card.location === 'shadows' &&
                    context.source.controller.canPutIntoPlay(card)
            },
            message: '{player} returns {source} to shadows to put {target} into play',
            gameAction: GameActions.putIntoPlay((context) => ({
                player: context.player,
                card: context.target
            }))
        });
    }
}

StarfallSpy.code = '11115';

export default StarfallSpy;
