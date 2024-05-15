import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class FirstBuilder extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ unique: true, controller: 'current' });
        this.whileAttached({
            effect: [ability.effects.addIcon('power'), ability.effects.addTrait('Builder')]
        });

        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    event.challenge.challengeType === 'power' &&
                    this.isBuilderParticipatingInChallenge(this.controller)
            },
            limit: ability.limit.perPhase(1),
            message: {
                format: '{player} uses {source} to search the top 10 cards of their deck for an attachment or location with printed cost {builders} or lower',
                args: { builders: () => this.getNumberOfBuilders(this.controller) }
            },
            gameAction: GameActions.search({
                title: 'Select a card',
                topCards: 10,
                match: {
                    type: ['attachment', 'location'],
                    condition: (card) =>
                        card.hasPrintedCost() &&
                        card.getPrintedCost() <= this.getNumberOfBuilders(this.controller)
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
