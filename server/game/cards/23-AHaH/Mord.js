import DrawCard from '../../drawcard.js';

class Mord extends DrawCard {
    // Mord (23025)
    // Action: Kneel Mord to choose a character controlled by a player whose initiative value is
    // equal to or higher than yours. Until Mord stands or leaves play, treat that character as if
    // its printed text box were blank (except for Traits).
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel to blank character',
            cost: ability.costs.kneelSelf(),
            target: {
                activePromptTitle: 'Select a character',
                cardCondition: {
                    location: 'play area',
                    type: 'character',
                    condition: (card, context) =>
                        card.controller.getInitiative() >= context.player.getInitiative()
                }
            },
            message:
                '{player} kneels {source} to treat the text box of {target} as blank until {source} stands or leaves play',
            handler: (context) => {
                this.lastingEffect((ability) => ({
                    until: {
                        onCardStood: (event) => event.card === this,
                        onCardLeftPlay: (event) =>
                            event.card === this || event.card === context.target
                    },
                    targetLocation: 'any',
                    match: context.target,
                    effect: ability.effects.blankExcludingTraits
                }));
            }
        });
    }
}

Mord.code = '23025';

export default Mord;
