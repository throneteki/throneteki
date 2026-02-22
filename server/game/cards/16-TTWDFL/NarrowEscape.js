import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import GenericTracker from '../../EventTrackers/GenericTracker.js';

class NarrowEscape extends DrawCard {
    setupCardAbilities(ability) {
        this.killTracker = GenericTracker.forPhase(this.game, 'onCharacterKilled');
        this.discardTracker = GenericTracker.forPhase(this.game, 'onCardDiscarded');

        this.action({
            title: 'Put characters into play',
            message: {
                format: '{player} plays {source} to put {characters} into play',
                args: { characters: () => this.getEligibleCharacters() }
            },
            handler: (context) => {
                const opponents = this.game.getOpponentsInFirstPlayerOrder(context.player);
                this.remainingOpponents = opponents.filter((opponent) => opponent.hand.length > 1);
                this.context = context;
                this.promptForCancel(context);
            },
            max: ability.limit.perPhase(1)
        });
    }

    promptForCancel(context) {
        if (this.remainingOpponents.length === 0 || context.ability.cannotBeCanceled) {
            this.resolvePutIntoPlay();
            return true;
        }

        const nextOpponent = this.remainingOpponents.shift();
        this.game.promptWithMenu(nextOpponent, this, {
            activePrompt: {
                menuTitle: 'Discard hand to cancel?',
                buttons: [
                    { text: 'Yes', method: 'cancelResolution' },
                    { text: 'No', method: 'promptForCancel' }
                ]
            },
            source: this
        });

        return true;
    }

    cancelResolution(opponent) {
        this.game.addMessage(
            '{0} discards their hand to cancel the effects of {1}',
            opponent,
            this
        );
        this.game.resolveGameAction(
            GameActions.simultaneously(() =>
                opponent.hand.map((card) => GameActions.discardCard({ card }))
            ),
            this.context
        );
        return true;
    }

    resolvePutIntoPlay() {
        this.game.resolveGameAction(
            GameActions.simultaneously(() => [
                ...this.getEligibleCharacters().map((card) =>
                    GameActions.putIntoPlay({
                        card,
                        player: card.owner
                    })
                )
            ]),
            this.context
        );
    }

    getEligibleCharacters() {
        const eligibleKilled = this.killTracker.events
            .map((event) => event.card)
            .filter((card) => card.location === 'dead pile');
        const eligibleDiscards = this.discardTracker.events
            .filter(
                (event) =>
                    event.originalLocation === 'play area' && event.card.location === 'discard pile'
            )
            .map((event) => event.card);
        return eligibleKilled
            .concat(eligibleDiscards)
            .filter((card) => card.owner.canPutIntoPlay(card));
    }
}

NarrowEscape.code = '16024';

export default NarrowEscape;
