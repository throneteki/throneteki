import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SeenInFlames extends DrawCard {
    // Seen In Flames (01064)
    // Play only if you control a R'hllor character.
    // Challenges Action: Choose an opponent, and look at his or her hand. Then, choose and discard
    // 1 card from that hand.
    setupCardAbilities() {
        this.action({
            title: "Look at opponent's hand",
            phase: 'challenge',
            condition: (context) =>
                context.player.anyCardsInPlay(
                    (card) => card.hasTrait("R'hllor") && card.getType() === 'character'
                ),
            chooseOpponent: true,
            message:
                "{player} plays {source} to look at {opponent}'s hand and discard 1 card from it",
            gameAction: GameActions.chooseCards({
                title: 'Select a card to discard',
                revealTargets: true,
                cardCondition: (card, context) =>
                    card.location === 'hand' && card.controller === context.opponent,
                gameAction: (card) => GameActions.discardCard({ card })
            })
        });
    }
}

SeenInFlames.code = '01064';

export default SeenInFlames;
