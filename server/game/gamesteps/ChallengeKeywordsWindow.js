const { sortBy } = require('underscore');
const AbilityContext = require('../AbilityContext.js');
const BaseStep = require('./basestep');

class ChallengeKeywordsWindow extends BaseStep {
    constructor(game, challenge) {
        super(game);
        this.challenge = challenge;
        this.resolvedAbilities = [];
    }

    buildContexts(cards, player) {
        return cards.map(card => {
            let context = new AbilityContext({ player, game: this.game, challenge: this.challenge, source: card });
            context.resolved = [];
            return { card: card, context: context };
        });
    }

    resolveAbility(ability, participants) {
        if(participants.length > 1) {
            if(typeof(ability.orderBy) === 'function') {
                this.queueAbility(ability, sortBy(participants, participant => ability.orderBy(participant.context)));
                return;
            } else if(ability.orderBy === 'prompt') {
                this.promptForOrder(ability, participants);
                return;
            }
        }

        this.queueAbility(ability, participants);
    }

    queueAbility(ability, participants) {
        for(let participant of participants) {
            this.game.queueSimpleStep(() => {
                participant.context.resolved = this.resolvedAbilities.filter(resolved => resolved.ability.title === ability.title);
                // Check this a second time; primarily in case a previous trigger has affected whether it can resolve (eg. additional triggers with Assault).
                if(!ability.canResolve(participant.context)) {
                    return;
                }

                this.game.resolveAbility(ability, participant.context);
                this.resolvedAbilities.push({ ability, context: participant.context });
            });
        }
    }

    promptForOrder(ability, participants) {
        this.game.getPlayersInFirstPlayerOrder().forEach(player => {
            let cards = participants.map(participant => participant.card).filter(card => card.controller === player);
            if(cards.length > 0) {
                this.game.promptForSelect(player, {
                    ordered: true,
                    mode: 'exactly',
                    numCards: participants.length,
                    activePromptTitle: `Select order for ${ability.title.toLowerCase()}`,
                    cardCondition: card => cards.includes(card),
                    onSelect: (player, selectedCards) => {
                        let finalParticipants = selectedCards.map(card => participants.find(participant => participant.card === card));
        
                        this.queueAbility(ability, finalParticipants);
        
                        return true;
                    },
                    onCancel: () => {
                        this.queueAbility(ability, participants);
                        return true;
                    }
                });
            }
        });
    }
}

module.exports = ChallengeKeywordsWindow;
