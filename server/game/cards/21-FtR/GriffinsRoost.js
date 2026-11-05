import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import { Tokens } from '../../Constants/index.js';

class GriffinsRoost extends DrawCard {
    // Griffin's Roost (21021)
    // While you control Jon Connington, he gains a [power] icon.
    // Reaction: After you win a [power] challenge, kneel your faction card to choose 1 card in your
    // hand and place it facedown in shadows with a shadow token on it. While that card is in
    // shadows, if it does not have the printed shadow keyword, it gains shadow (X). X is its
    // printed cost.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.name === 'Jon Connington',
            effect: ability.effects.addIcon('power')
        });
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.isMatch({ winner: context.player, challengeType: 'power' })
            },
            cost: ability.costs.kneelFactionCard(),
            target: {
                type: 'select',
                cardCondition: (card, context) =>
                    card.location === 'hand' && card.controller === context.player
            },
            message: '{player} uses {source} to put a card from their hand into shadows',
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

GriffinsRoost.code = '21021';

export default GriffinsRoost;
