import DrawCard from '../../drawcard.js';

class YouthfulAcolyte extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this && this.game.isDuringChallenge()
            },
            target: {
                cardCondition: (card) =>
                    card.getType() === 'character' &&
                    card.isParticipating() &&
                    card.controller === this.controller
            },
            handler: (context) => {
                context.target.controller.standCard(context.target);
                this.game.currentChallenge.removeFromChallenge(context.target);
                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: ability.effects.addKeyword('renown')
                }));

                this.game.addMessage(
                    '{0} uses {1} to stand and remove {2} from the challenge and give it renown',
                    context.player,
                    this,
                    context.target
                );
            }
        });
    }
}

YouthfulAcolyte.code = '00289';

export default YouthfulAcolyte;
