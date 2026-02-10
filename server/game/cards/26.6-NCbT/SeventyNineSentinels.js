import DrawCard from '../../drawcard.js';

class SeventyNineSentinels extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel to defend',
            condition: () =>
                this.controller.anyCardsInPlay({
                    type: 'character',
                    defending: true,
                    faction: 'thenightswatch'
                }),
            phase: 'challenge',
            cost: ability.costs.kneelAny(
                (card) =>
                    card.getType() === 'character' &&
                    card.isFaction('thenightswatch') &&
                    card.getNumberOfIcons() <= 1
            ),
            message:
                '{player} plays {source} and kneels {costs.kneel} to have each participate in the challenge on their side',
            handler: (context) => {
                for (const card of context.costs.kneel) {
                    this.game.currentChallenge.addParticipantToSide(context.player, card);
                }
            }
        });
    }
}

SeventyNineSentinels.code = '26110';

export default SeventyNineSentinels;
