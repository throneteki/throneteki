import AgendaCard from '../../agendacard.js';
import GameActions from '../../GameActions/index.js';
import { Tokens } from '../../Constants/index.js';

class AssaultFromTheShadows extends AgendaCard {
    // Assault from the Shadows (11118)
    // Reduce the gold value on your revealed plot card by 1.
    // Marshaling Action: Kneel your faction card to choose 1 card in your hand and place it
    // facedown in shadows with a shadow token on it. While that card is in shadows, if it does not
    // have the printed shadow keyword, it gains shadow (X). X is its printed cost.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            match: (card, context) => card === context.source.controller.activePlot,
            effect: ability.effects.modifyGold(-1)
        });
        this.action({
            title: 'Put card into shadows',
            phase: 'marshal',
            cost: ability.costs.kneelFactionCard(),
            target: {
                type: 'select',
                cardCondition: (card, context) =>
                    card.location === 'hand' && card.controller === context.player
            },
            message:
                '{player} uses {source} and kneels their faction card to put a card from their hand into shadows',
            gameAction: GameActions.putIntoShadows((context) => ({ card: context.target })).then(
                (context, event) => {
                    const card = event.card;
                    const actions = [GameActions.placeToken({ card, token: Tokens.shadow })];
                    if (
                        !card.getPrintedKeywords().some((keyword) => keyword.startsWith('shadow'))
                    ) {
                        const shadowCost = card.translateXValue(card.getPrintedCost());
                        actions.push(
                            GameActions.lastingEffect(() => ({
                                duration: 'custom',
                                until: {
                                    onCardMoved: (event) =>
                                        event.card === card && event.originalLocation === 'shadows'
                                },
                                match: card,
                                targetLocation: 'shadows',
                                effect: ability.effects.addKeyword(`Shadow (${shadowCost})`)
                            }))
                        );
                    }
                    return { gameAction: GameActions.simultaneously(actions) };
                }
            )
        });
    }
}

AssaultFromTheShadows.code = '11118';

export default AssaultFromTheShadows;
