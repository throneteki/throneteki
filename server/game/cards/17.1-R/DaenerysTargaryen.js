import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class DaenerysTargaryen extends DrawCard {
    // Daenerys Targaryen (17128)
    // Action: Kneel your faction card to search the top 10 cards of your deck for a Dragon or Title
    // card and put it into play. Shuffle your deck. At the end of the phase, if that card is still
    // in play and not attached to Daenerys Targaryen, return it to your hand (cannot be saved).
    setupCardAbilities(ability) {
        this.action({
            title: 'Search deck',
            cost: ability.costs.kneelFactionCard(),
            message:
                '{player} uses {source} to search the top 10 cards of their deck for a Dragon or Title card',
            gameAction: GameActions.search({
                title: 'Select a card',
                match: { trait: ['Dragon', 'Title'] },
                topCards: 10,
                reveal: false,
                message: '{player} {gameAction}',
                gameAction: GameActions.putIntoPlay((context) => ({
                    card: context.searchTarget
                })).then({
                    gameAction: GameActions.delayedEffect((context) => {
                        const card = context.event.card;
                        return {
                            duration: 'untilTriggered',
                            title: card.name,
                            when: { onAtEndOfPhase: () => true },
                            until: { onCardLeftPlay: (event) => event.card === card },
                            gameAction: GameActions.ifCondition({
                                condition: () =>
                                    ['play area', 'duplicate'].includes(card.location) &&
                                    (!card.parent || card.parent.name !== 'Daenerys Targaryen'),
                                thenAction: {
                                    message:
                                        '{player} resolves the delayed effect from {source}: {gameAction}',
                                    gameAction: GameActions.returnCardToHand({
                                        card,
                                        allowSave: false
                                    })
                                }
                            })
                        };
                    })
                })
            })
        });
    }
}

DaenerysTargaryen.code = '17128';

export default DaenerysTargaryen;
