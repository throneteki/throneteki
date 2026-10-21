import DrawCard from '../../drawcard.js';

class HiddenThorns extends DrawCard {
    // Hidden Thorns (09024)
    // Reaction: After you win an [intrigue] challenge by 5 or more STR, the losing opponent chooses
    // and discards 2 cards from his or her hand. Then, if you control The Queen of Thorns, return
    // Hidden Thorns to your hand instead of placing it in your discard pile. (Max 1 per challenge.)
    setupCardAbilities(ability) {
        this.reaction({
            max: ability.limit.perChallenge(1),
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    event.challenge.challengeType === 'intrigue' &&
                    event.challenge.strengthDifference >= 5
            },
            handler: (context) => {
                let loser = context.event.challenge.loser;
                this.game.promptForSelect(loser, {
                    numCards: 2,
                    activePromptTitle: 'Select 2 cards',
                    cardCondition: (card) => card.controller === loser && card.location === 'hand',
                    onSelect: (player, cards) => this.discardCards(player, cards),
                    onCancel: (player) => this.cancelResolution(player)
                });
            }
        });
    }

    discardCards(player, cards) {
        player.discardCards(cards);
        this.game.addMessage(
            '{0} uses {1} to make {2} choose and discard {3}',
            this.controller,
            this,
            player,
            cards
        );

        if (this.controller.anyCardsInPlay((card) => card.name === 'The Queen of Thorns')) {
            this.lastingEffect((ability) => ({
                until: {
                    onCardPlayed: (event) => event.card === this
                },
                targetLocation: 'any',
                match: this,
                effect: ability.effects.setEventPlacementLocation('hand')
            }));
        }

        return true;
    }

    cancelResolution(player) {
        this.game.addAlert('danger', '{0} cancels resolution of {1}', player, this);

        return true;
    }
}

HiddenThorns.code = '09024';

export default HiddenThorns;
