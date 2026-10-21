import DrawCard from '../../drawcard.js';

class RecruiterForTheWatch extends DrawCard {
    // Recruiter for the Watch (06045)
    // You may choose not to stand Recruiter for the Watch during the standing phase.
    // Marshaling Action: Kneel Recruiter for the Watch to choose a character with printed cost 2 or
    // lower. Take control of that character until Recruiter for the Watch stands or leaves play.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.optionalStandDuringStanding()
        });
        this.action({
            title: 'Take control of character',
            phase: 'marshal',
            cost: ability.costs.kneelSelf(),
            target: {
                activePromptTitle: 'Select character with printed cost 2 or less',
                cardCondition: (card) =>
                    card.getType() === 'character' &&
                    card.location === 'play area' &&
                    card.getPrintedCost() <= 2
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} kneels {1} to take control of {2}',
                    this.controller,
                    this,
                    context.target
                );
                this.lastingEffect((ability) => ({
                    until: {
                        onCardStood: (event) => event.card === this,
                        onCardLeftPlay: (event) =>
                            event.card === this || event.card === context.target
                    },
                    match: context.target,
                    effect: ability.effects.takeControl(this.controller)
                }));
            }
        });
    }
}

RecruiterForTheWatch.code = '06045';

export default RecruiterForTheWatch;
