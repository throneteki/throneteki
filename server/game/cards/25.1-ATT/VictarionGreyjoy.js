import DrawCard from '../../drawcard.js';

class VictarionGreyjoy extends DrawCard {
    // Victarion Greyjoy (25003)
    // Reaction: After a phase begins, kneel a character you control. If it has the:
    // - R’hllor trait, Victarion Greyjoy gains insight and "immune to opponents' character
    // abilities" until the end of the phase.
    // - Drowned God trait, Victarion Greyjoy gains renown and cannot be killed until the end of the
    // phase.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onPhaseStarted: () => true
            },
            cost: ability.costs.kneel((card) => card.getType() === 'character'),
            handler: (context) => {
                let bonusMessage = [];
                let effects = [];

                if (context.costs.kneel.hasTrait("R'hllor")) {
                    effects.push(ability.effects.addKeyword('insight'));
                    effects.push(
                        ability.effects.immuneTo(
                            (card) =>
                                card.controller !== this.controller &&
                                card.getType() === 'character'
                        )
                    );
                    bonusMessage.push('insight');
                    bonusMessage.push("immunity to opponent's character abilities");
                }

                if (context.costs.kneel.hasTrait('Drowned God')) {
                    effects.push(ability.effects.addKeyword('renown'));
                    effects.push(ability.effects.cannotBeKilled());
                    bonusMessage.push('renown');
                    bonusMessage.push('cannot be killed');
                }

                this.untilEndOfPhase(() => ({
                    match: this,
                    effect: effects
                }));
                this.game.addMessage(
                    '{0} uses {1} to have {1} gain {2} until the end of the phase',
                    this.controller,
                    this,
                    bonusMessage
                );
            }
        });
    }
}

VictarionGreyjoy.code = '25003';

export default VictarionGreyjoy;
