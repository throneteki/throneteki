import DrawCard from '../../drawcard.js';
import TextHelper from '../../TextHelper.js';

class BranStark extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) =>
                card.getType() === 'character' &&
                card.hasTrait('Old Gods') &&
                card.controller === this.controller,
            effect: ability.effects.cannotBeKneeled(
                (context) => context.resolutionStage === 'effect'
            )
        });
        this.interrupt({
            when: {
                onClaimApplied: (event) =>
                    event.challenge.isMatch({ challengeType: 'intrigue' }) &&
                    event.challenge.defendingPlayer.hand.length !== 0 &&
                    event.challenge
                        .getParticipants()
                        .some(
                            (card) =>
                                card.controller === this.controller && card.hasTrait('Old Gods')
                        )
            },
            handler: (context) => {
                let defendingPlayer = this.game.currentChallenge.defendingPlayer;
                let xValue = Math.min(
                    this.game.currentChallenge.winner.getClaim(),
                    defendingPlayer.hand.length
                );
                context.replaceHandler(() => {
                    this.game.addMessage(
                        "{0} uses {1} to look at {2}'s hand instead of the normal claim effects",
                        context.player,
                        this,
                        defendingPlayer
                    );
                    this.game.promptForSelect(context.player, {
                        mode: 'exactly',
                        activePromptTitle: `Select ${TextHelper.count(xValue, 'card')}`,
                        numCards: xValue,
                        source: this,
                        revealTargets: true,
                        cardCondition: (card) =>
                            card.location === 'hand' && card.controller === defendingPlayer,
                        onSelect: (player, cards) =>
                            this.cardsSelected(player, defendingPlayer, cards)
                    });
                });
            }
        });
    }

    cardsSelected(player, defendingPlayer, cards) {
        defendingPlayer.discardCards(cards);
        this.game.addMessage(
            "{0} then uses {1} to discard {2} from {3}'s hand",
            player,
            this,
            cards,
            defendingPlayer
        );
        return true;
    }
}

BranStark.code = '22016';

export default BranStark;
