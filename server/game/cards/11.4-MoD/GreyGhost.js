const DrawCard = require('../../drawcard');
const CardEntersPlayTracker = require('../../EventTrackers/CardEntersPlayTracker');

class GreyGhost extends DrawCard {
    setupCardAbilities(ability) {
        this.tracker = CardEntersPlayTracker.forPhase(this.game);

        this.action({
            title: 'Prevent character(s) from defending',
            cost: ability.costs.kneelSelf(),
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    multiSelect: true,
                    numCards: this.tracker.hasComeOutOfShadows(this) ? 2 : 1,
                    activePromptTitle: this.tracker.hasComeOutOfShadows(this)
                        ? 'Select 2 characters'
                        : 'Select a character',
                    source: this,
                    cardCondition: (card) =>
                        card.location === 'play area' && card.getType() === 'character',
                    onSelect: (player, cards) => this.onSelect(player, cards),
                    onCancel: (player) => this.cancelSelection(player)
                });
            }
        });
    }

    onSelect(player, cards) {
        this.untilEndOfPhase((ability) => ({
            match: (card) => cards.some((c) => card === c),
            targetController: 'opponent',
            effect: ability.effects.cannotBeDeclaredAsDefender()
        }));

        this.game.addMessage(
            '{0} kneels {1} to make {2} unable to be declared as {3}',
            this.controller,
            this,
            cards,
            cards.length === 1 ? 'a defender' : 'defenders'
        );
        return true;
    }

    cancelSelection(player) {
        this.game.addAlert('danger', '{0} cancels the resolution of {1}', player, this);
    }
}

GreyGhost.code = '11072';

module.exports = GreyGhost;
