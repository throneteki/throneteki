import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import { Tokens } from '../../Constants/index.js';

class TheTatteredPrince extends DrawCard {
    // The Tattered Prince (18008)
    // Bestow (2). Renown. Shadow (2).
    // Forced Reaction: After a plot card enters your used pile, return The Tattered Prince to
    // shadows unless you discard 1 gold from him.
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                onCardPlaced: (event) =>
                    event.location === 'revealed plots' && event.player === this.controller
            },
            gameAction: GameActions.ifCondition({
                condition: (context) => context.source.hasToken(Tokens.gold),
                thenAction: GameActions.choose({
                    title: (context) => `Discard 1 gold for ${context.source.name}?`,
                    choices: {
                        Yes: {
                            message: '{player} chooses to discard a gold from {source}',
                            gameAction: GameActions.discardToken((context) => ({
                                card: context.source,
                                token: Tokens.gold
                            }))
                        },
                        No: {
                            message: '{player} chooses to return {source} to shadows',
                            gameAction: GameActions.putIntoShadows((context) => ({
                                card: context.source
                            }))
                        }
                    }
                }),
                elseAction: {
                    message: '{player} is forced to return {source} to shadows',
                    gameAction: GameActions.putIntoShadows((context) => ({ card: context.source }))
                }
            })
        });
    }
}

TheTatteredPrince.code = '18008';

export default TheTatteredPrince;
