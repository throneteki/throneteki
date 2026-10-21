import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class FirstBuilder extends DrawCard {
    // First Builder (22015)
    // Unique character you control only.
    // Attached character gains a [power] icon and the Builder trait.
    // Reaction: After you win a [power] challenge in which you control a participating Builder
    // character, search the top 10 cards of your deck for an attachment or location with printed
    // cost X or lower, reveal it, and add it to your hand. X is the number of Builder characters
    // you control. Shuffle your deck. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.attachmentRestriction({ unique: true, controller: 'current' });
        this.whileAttached({
            effect: [ability.effects.addIcon('power'), ability.effects.addTrait('Builder')]
        });

        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    event.challenge.challengeType === 'power' &&
                    context.source.isBuilderParticipatingInChallenge(context.source.controller)
            },
            limit: ability.limit.perPhase(1),
            message: {
                format: '{player} uses {source} to search the top 10 cards of their deck for an attachment or location with printed cost {builders} or lower',
                args: {
                    builders: (context) =>
                        context.source.getNumberOfBuilders(context.source.controller)
                }
            },
            gameAction: GameActions.search({
                title: 'Select a card',
                topCards: 10,
                match: {
                    type: ['attachment', 'location'],
                    condition: (card, context) =>
                        card.hasPrintedCost() &&
                        card.getPrintedCost() <=
                            context.source.getNumberOfBuilders(context.source.controller)
                },
                message: '{player} {gameAction}',
                gameAction: GameActions.addToHand((context) => ({
                    card: context.searchTarget
                }))
            })
        });
    }

    isBuilderParticipatingInChallenge(player) {
        return player.anyCardsInPlay((card) => card.isParticipating() && card.hasTrait('Builder'));
    }

    getNumberOfBuilders(player) {
        return player.getNumberOfCardsInPlay(
            (card) => card.getType() === 'character' && card.hasTrait('Builder')
        );
    }
}

FirstBuilder.code = '22015';

export default FirstBuilder;
