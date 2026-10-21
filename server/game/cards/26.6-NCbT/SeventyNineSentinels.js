import DrawCard from '../../drawcard.js';

class SeventyNineSentinels extends DrawCard {
    // Seventy-Nine Sentinels (26110)
    // Challenges Action: During a challenge in which you control a defending [thenightswatch]
    // character, kneel any number of [thenightswatch] characters with 1 or fewer challenge icons to
    // have them participate in the challenge on your side.
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
