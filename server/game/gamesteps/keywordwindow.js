const _ = require('underscore');

const BaseStep = require('./basestep.js');
const GameKeywords = require('../gamekeywords.js');

const challengeKeywords = ['insight', 'intimidate', 'pillage', 'renown'];

class KeywordWindow extends BaseStep {
    constructor(game, challenge) {
        super(game);
        this.challenge = challenge;
        this.winnerCardsWithContext = _.map(challenge.getWinnerCards(), card => {
            return { card: card, context: { game: this.game, challenge: this.challenge, source: card } };
        });
    }

    continue() {
        if(!this.challenge.winner) {
            return;
        }

        _.each(challengeKeywords, keyword => {
            this.applyKeyword(keyword);
        });

        return true;
    }

    applyKeyword(keyword) {
        let ability = GameKeywords[keyword];
        let participantsWithKeyword = this.getParticipantsForKeyword(keyword, ability);

        if(keyword === 'pillage' && _.size(participantsWithKeyword) > 1) {
            this.promptForPillageOrder(ability, participantsWithKeyword);
        } else {
            this.resolveAbility(ability, participantsWithKeyword);
        }

        this.game.checkWinCondition(this.challenge.winner);
    }

    getParticipantsForKeyword(keyword, ability) {
        let participants = _.filter(this.winnerCardsWithContext, participant => {
            return participant.card.hasKeyword(keyword) && ability.meetsRequirements(participant.context);
        });

        if(keyword === 'intimidate' && !_.isEmpty(participants)) {
            return [participants[0]];
        }

        return participants;
    }

    promptForPillageOrder(ability, participants) {
        let cards = _.pluck(participants, 'card');
        this.game.promptForSelect(this.challenge.winner, {
            ordered: true,
            multiSelect: true,
            numCards: _.size(participants),
            activePromptTitle: 'Select order for pillage',
            cardCondition: card => cards.includes(card),
            onSelect: (player, selectedCards) => {
                if(selectedCards.length !== cards.length) {
                    return false;
                }

                let finalParticipants = _.map(selectedCards, card => _.find(participants, participant => participant.card === card));

                this.resolveAbility(ability, finalParticipants);

                return true;
            },
            onCancel: () => {
                this.resolveAbility(ability, participants);
                return true;
            }
        });
    }

    resolveAbility(ability, participants) {
        _.each(participants, participant => {
            this.game.resolveAbility(ability, participant.context);
        });
    }
}

module.exports = KeywordWindow;
