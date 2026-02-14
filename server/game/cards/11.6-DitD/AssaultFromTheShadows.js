import AgendaCard from '../../agendacard.js';
import { Tokens } from '../../Constants/index.js';

class AssaultFromTheShadows extends AgendaCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            match: (card) => card === card.controller.activePlot,
            effect: ability.effects.modifyGold(-1)
        });

        this.action({
            title: 'Put card into shadows',
            phase: 'marshal',
            cost: ability.costs.kneelFactionCard(),
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: (card) =>
                    card.location === 'hand' && card.controller === this.controller,
                // Even though the card text uses the word 'choose', use a non
                // targeting prompt to prevent the card from being revealed
                // when the opponent is prompted to cancel the ability.
                type: 'select'
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} uses {1} and kneels their faction card to put a card into shadow',
                    context.player,
                    this
                );
                context.player.putIntoShadows(context.target, false, () => {
                    context.target.modifyToken(Tokens.shadow, 1);

                    if (!context.target.isShadow()) {
                        this.lastingEffect((ability) => ({
                            condition: () => context.target.location === 'shadows',
                            targetLocation: 'any',
                            match: context.target,
                            effect: ability.effects.addKeyword(
                                `Shadow (${context.target.translateXValue(context.target.getPrintedCost())})`
                            )
                        }));
                    }
                });
            }
        });
    }
}

AssaultFromTheShadows.code = '11118';

export default AssaultFromTheShadows;
