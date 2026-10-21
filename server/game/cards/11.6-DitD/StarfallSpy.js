import DrawCard from '../../drawcard.js';

class StarfallSpy extends DrawCard {
    // Starfall Spy (11115)
    // Shadow (3).
    // Reaction: After you win a challenge in which Starfall Spy is participating, return it to
    // shadows to choose another card you control in shadows and put it into play.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller && this.isParticipating()
            },
            cost: ability.costs.putSelfIntoShadows(),
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: (card) =>
                    card.controller === this.controller &&
                    card !== this &&
                    card.location === 'shadows' &&
                    this.controller.canPutIntoPlay(card)
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} returns {1} to shadows to put {2} into play',
                    context.player,
                    this,
                    context.target
                );
                context.player.putIntoPlay(context.target);
            }
        });
    }
}

StarfallSpy.code = '11115';

export default StarfallSpy;
