import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class IPledgeMyLifeAndHonor extends DrawCard {
    // I Pledge My Life and Honor (20024)
    // Reaction: After you win a challenge as the defending player, search the top 10 cards of your
    // deck for a [thenightswatch] character and put it into play. Shuffle your deck. Then,
    // sacrifice a character that shares a Trait with that character.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    event.challenge.defendingPlayer === this.controller
            },
            message:
                '{player} plays {source} to search the top 10 cards of their deck for a The Nights Watch character',
            gameAction: GameActions.search({
                title: 'Select a character',
                match: { type: 'character', faction: 'thenightswatch' },
                topCards: 10,
                reveal: false,
                message: '{player} {gameAction}',
                gameAction: GameActions.putIntoPlay((context) => ({
                    card: context.searchTarget
                })).then({
                    activePromptTitle: 'Select character to sacrifice',
                    target: {
                        cardCondition: {
                            type: 'character',
                            location: 'play area',
                            condition: (card, context) =>
                                card
                                    .getTraits()
                                    .some((trait) =>
                                        context.parentContext.searchTarget.hasTrait(trait)
                                    )
                        }
                    },
                    message: 'Then, {player} sacrifices {target}',
                    handler: (context) => {
                        this.game.resolveGameAction(
                            GameActions.sacrificeCard((context) => ({ card: context.target })),
                            context
                        );
                    }
                })
            })
        });
    }
}

IPledgeMyLifeAndHonor.code = '20024';

export default IPledgeMyLifeAndHonor;
