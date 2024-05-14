const PlotCard = require('../../plotcard.js');

class Duel extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            chooseOpponent: true,
            handler: (context) => {
                let opponent = context.opponent;

                if (this.notEnoughTargets(context)) {
                    return;
                }

                this.game.addMessage(
                    '{0} uses {1} to have {2} choose 2 non-Army characters with printed cost 6 or higher',
                    context.player,
                    this,
                    opponent
                );

                this.game.promptForSelect(opponent, {
                    mode: 'exactly',
                    numCards: 2,
                    activePromptTitle: 'Select two characters',
                    source: this,
                    cardCondition: (card, context) => this.cardCondition(card, context),
                    onSelect: (player, cards) => this.targetsSelected(player, cards)
                });
            }
        });
    }

    cardCondition(card, context) {
        return (
            card.location === 'play area' &&
            !card.hasTrait('Army') &&
            card.getType() === 'character' &&
            card.getPrintedCost() >= 6 &&
            ((!card.kneeled && card.allowGameAction('kneel', context)) ||
                card.allowGameAction('kill', context))
        );
    }

    targetsSelected(player, cards) {
        this.targets = cards;
        this.game.addMessage('{0} chooses {1} as the targets for {2}', player, cards, this);

        this.game.promptForSelect(player, {
            activePromptTitle: 'Choose character to kneel',
            cardCondition: (card) => cards.includes(card) && !card.kneeled,
            gameAction: 'kneel',
            source: this,
            onSelect: (player, card) => this.resolve(player, card),
            onCancel: (player) => this.cancel(player)
        });

        return true;
    }

    resolve(player, cardToKneel) {
        const cardToKill = this.targets.find((card) => card !== cardToKneel);

        player.kneelCard(cardToKneel);
        this.game.killCharacter(cardToKill, { allowSave: false });

        this.game.addMessage(
            '{0} then chooses {1} to kneel, {2} is killed',
            player,
            cardToKneel,
            cardToKill
        );

        return true;
    }

    cancel(player) {
        this.game.addAlert('danger', '{0} cancels the resolution of {1}', player, this);

        return true;
    }

    notEnoughTargets(context) {
        return this.game.getNumberOfCardsInPlay((card) => this.cardCondition(card, context)) < 2;
    }
}

Duel.code = '06060';

module.exports = Duel;
