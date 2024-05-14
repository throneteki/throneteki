import DrawCard from '../../drawcard.js';

class WunWun extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel Wun Wun to have him participate in the current challenge',
            condition: () => this.isWildlingdParticipatingInChallenge(),
            cost: ability.costs.kneelSelf(),
            handler: (context) => {
                this.game.currentChallenge.addParticipantToSide(context.player, this);

                this.game.addMessage(
                    '{0} uses {1} to kneel {1} and add them to the challenge',
                    context.player,
                    this
                );
            }
        });
    }

    isWildlingdParticipatingInChallenge() {
        return this.controller.anyCardsInPlay(
            (card) => card.isParticipating() && card.hasTrait('wildling')
        );
    }
}

WunWun.code = '11077';

export default WunWun;
