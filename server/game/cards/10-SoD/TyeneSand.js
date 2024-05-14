import DrawCard from '../../drawcard.js';

class TyeneSand extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.loser === this.controller &&
                    event.challenge.defendingPlayer === this.controller &&
                    this.controller.canPutIntoPlay(this)
            },
            location: 'hand',
            cost: ability.costs.kneel(
                (card) => card.hasTrait('Sand Snake') && card.getType() === 'character'
            ),
            handler: (context) => {
                context.player.putIntoPlay(this);
                this.game.addMessage(
                    '{0} kneels {1} to put {2} into play from their hand',
                    context.player,
                    context.costs.kneel,
                    this
                );
            }
        });
    }
}

TyeneSand.code = '10008';

export default TyeneSand;
