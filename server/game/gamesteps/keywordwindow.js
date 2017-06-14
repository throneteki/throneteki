const _ = require('underscore');

const BaseStep = require('./basestep.js');

const ChallengeKeywords = ['Pillage', 'Intimidate', 'Insight', 'Renown'];

class KeywordWindow extends BaseStep {
    constructor(game, participants) {
        super(game);
        this.participants = participants;
        this.processedKeywords = [];
    }

    continue() {
        let participantKeywords = _.filter(ChallengeKeywords, keyword => _.any(this.participants, participant => participant.hasKeyword(keyword)));
        let remainingKeywords = _.difference(participantKeywords, this.processedKeywords);

        if(remainingKeywords.length > 1) {
            this.promptPlayer(remainingKeywords);
            return false;
        }

        _.each(remainingKeywords, keyword => {
            this.processKeyword(null, keyword);
        });

        return true;
    }

    promptPlayer(remainingKeywords) {
        let buttons = _.chain(remainingKeywords)
            .map(keyword => {
                return { text: keyword, method: 'processKeyword', arg: keyword };
            })
            .sortBy('text')
            .value();

        this.game.promptWithMenu(this.game.getFirstPlayer(), this, {
            activePrompt: {
                menuTitle: 'Choose keyword to resolve',
                buttons: buttons
            },
            waitingPromptTitle: 'Waiting for opponents to choose keyword order'
        });
    }

    processKeyword(player, keyword) {
        this.processedKeywords.push(keyword);
        return true;
    }
}

module.exports = KeywordWindow;
