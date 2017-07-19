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

        _.each(participantsWithKeyword, participant => {
            this.game.resolveAbility(ability, participant.context);
        });

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
}

module.exports = KeywordWindow;
