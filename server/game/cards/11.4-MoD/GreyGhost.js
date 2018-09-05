const DrawCard = require('../../drawcard');

class GreyGhost extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.tracker = new ShadowsTracker(this.game, this);
    }

    setupCardAbilities(ability) {
        this.action({
            title: 'Choose character(s)',
            cost: ability.costs.kneelSelf(),
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    numCards: this.tracker.hasComeOutOfShadowsThisPhase ? 2 : 1,
                    activePromptTitle: this.tracker.hasComeOutOfShadowsThisPhase ? 'Select 2 characters' : 'Select a character',
                    source: this,
                    cardCondition: card => card.location === 'play area' && card.getType() === 'character',
                    onSelect: (player, cards) => this.onSelect(player, cards),
                    onCancel: (player) => this.cancelSelection(player)
                });
            }
        });
    }

    onSelect(player, cards) {
        if(!Array.isArray(cards)) {
            cards = [cards];
        }

        this.untilEndOfPhase(ability => ({
            match: card => cards.some(c => card === c),
            targetController: 'opponent',
            effect: ability.effects.cannotBeDeclaredAsDefender()
        }));

        this.game.addMessage('{0} kneels {1} to make {2} unable to be declared as {3}',
            this.controller, this, cards, cards.length === 1 ? 'a defender' : 'defenders');
        return true;
    }

    cancelSelection(player) {
        this.selections.push({ player: player, cards: [] });
        this.proceedToNextStep();
    }
}

class ShadowsTracker {
    constructor(game, card) {
        this.hasComeOutOfShadowsThisPhase = false;
        game.on('onCardOutOfShadows', event => {
            if(event.card === card) {
                this.hasComeOutOfShadowsThisPhase = true;
            }
        });
        game.on('onPhaseEnded', () => this.hasComeOutOfShadowsThisPhase = false);
    }
}

GreyGhost.code = '11072';

module.exports = GreyGhost;
