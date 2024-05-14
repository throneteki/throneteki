const DrawCard = require('../../drawcard');
const PaidGoldTracker = require('../../EventTrackers/PaidGoldTracker');

// XXX Restrict to one effect per card title (ie multiple madames should not trigger)
class BrothelMadame extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.tracker = new PaidGoldTracker(this.game);

        this.registerEvents(['onGoldTransferred']);
    }

    setupCardAbilities() {
        this.reaction({
            when: {
                onPhaseStarted: (event) => event.phase === 'challenge'
            },
            chooseOpponent: true,
            handler: (context) => {
                if (this.tracker.hasPaid(context.opponent, this.controller)) {
                    this.game.addMessage(
                        '{0} has already paid {1} for {2} and does not need to pay again',
                        context.opponent,
                        this.controller,
                        this
                    );
                    return;
                }

                this.chosenOpponent = context.opponent;
                this.hasPaymentMessageBeenPrinted = false;

                this.untilEndOfPhase((ability) => ({
                    targetController: context.opponent,
                    condition: () => !this.tracker.hasPaid(context.opponent, this.controller),
                    effect: ability.effects.cannotInitiateChallengeType(
                        'military',
                        (opponent) => opponent === this.controller
                    )
                }));

                if (context.opponent.getSpendableGold({ activePlayer: context.opponent }) >= 1) {
                    this.game.promptWithMenu(context.opponent, this, {
                        activePrompt: {
                            menuTitle: 'Pay 1 gold to initiate military challenges this phase?',
                            buttons: [
                                { text: 'Yes', method: 'payOneGold' },
                                { text: 'No', method: 'doNotPay' }
                            ]
                        },
                        source: this
                    });
                } else {
                    this.doNotPay(context.opponent);
                }
            }
        });
    }

    onGoldTransferred(event) {
        if (
            event.target !== this.controller ||
            event.source !== this.chosenOpponent ||
            event.amount <= 0
        ) {
            return false;
        }

        if (this.hasPaymentMessageBeenPrinted) {
            return true;
        }

        this.hasPaymentMessageBeenPrinted = true;
        this.game.addMessage(
            '{0} pays {1} and can now initiate {2} challenges this phase',
            event.source,
            event.target,
            'military'
        );
    }

    payOneGold(player) {
        if (player.getSpendableGold({ activePlayer: player }) < 1) {
            return false;
        }

        this.game.transferGold({
            from: player,
            to: this.controller,
            amount: 1,
            activePlayer: player
        });

        this.game.addMessage('{0} uses {1} to make {2} pay 1 gold', this.controller, this, player);

        return true;
    }

    doNotPay(player) {
        this.game.addMessage('{0} does not give {1} 1 gold for {2}', player, this.controller, this);

        return true;
    }
}

BrothelMadame.code = '02029';

module.exports = BrothelMadame;
