const GameActions = require('../../GameActions/index.js');
const DrawCard = require('../../drawcard.js');
const Message = require('../../Message.js');

class LegacyOfTheWatch extends DrawCard {
    setupCardAbilities() {
        this.attachmentRestriction({ type: 'location', faction: 'thenightswatch', controller: 'current', unique: true });

        this.reaction({
            when: {
                afterChallenge: event => event.challenge.winner === this.controller && event.challenge.strengthDifference >= 5 && this.satisfiableBonuses(event.challenge).length > 0
            },
            handler: context => {
                let bonuses = this.satisfiableBonuses(context.event.challenge);
                if(bonuses.includes('stand')) {
                    this.game.promptForSelect(this.controller, {
                        activePromptTitle: 'Select a location',
                        cardCondition: card => this.canStandLocation(card),
                        onSelect: (player, card) => this.activateBonuses(bonuses, card),
                        onCancel: () => this.activateBonuses(bonuses, null),
                        source: this
                    });
                    return;
                }

                this.activateBonuses(bonuses, null);
            }
        });
    }

    canStandLocation(card) {
        return card.location === 'play area' && card.getType() === 'location' && card.isFaction('thenightswatch') && card.kneeled;
    }

    satisfiableBonuses(challenge) {
        let satisfiable = [];
        let participants = challenge.getParticipants().filter(card => card.controller === this.controller);
        if(participants.filter(card => card.hasTrait('Ranger')).length >= 2 && this.controller.canGainFactionPower()) {
            satisfiable.push('power');
        }
        if(participants.filter(card => card.hasTrait('Steward')).length >= 2 && this.controller.canDraw()) {
            satisfiable.push('draw');
        }
        if(participants.filter(card => card.hasTrait('Builder')).length >= 2 && this.game.anyCardsInPlay(card => this.canStandLocation(card))) {
            satisfiable.push('stand');
        }
        return satisfiable;
    }

    activateBonuses(bonuses, location) {
        let bonusMessages = [];
        let gameActions = [];

        if(bonuses.includes('power')) {
            gameActions.push(GameActions.gainPower({ card: this.controller.faction, amount: 1 }));
            bonusMessages.push('gain 1 power for their faction');
        }

        if(bonuses.includes('draw')) {
            gameActions.push(GameActions.drawCards({ player: this.controller, amount: 2 }));
            bonusMessages.push('draw 2 card');
        }

        if(bonuses.includes('stand') && location) {
            gameActions.push(GameActions.standCard({ card: location }));
            bonusMessages.push(Message.fragment('stand {card}', { card: location }));
        }

        this.game.addMessage('{0} uses {1} to {2}', this.controller, this, bonusMessages);
        this.game.resolveGameAction(GameActions.simultaneously(gameActions));
        return true;
    }
}

LegacyOfTheWatch.code = '25050';

module.exports = LegacyOfTheWatch;
