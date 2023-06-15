const {sortBy} = require('../../Array');

const ChallengeKeywordsWindow = require('./ChallengeKeywordsWindow');
const GameKeywords = require('../gamekeywords.js');

const resolutionKeywords = ['insight', 'intimidate', 'pillage', 'renown'];

class ResolutionKeywordsWindow extends ChallengeKeywordsWindow {
    constructor(game, challenge) {
        super(game, challenge);
        this.winnerCardsWithContext = this.buildContexts(challenge.getWinnerCards(), this.challenge.winner);
        this.firstPlayer = game.getFirstPlayer();
        this.remainingKeywords = resolutionKeywords;
    }

    continue() {
        if(!this.challenge.winner) {
            return true;
        }

        if(this.firstPlayer.keywordSettings.chooseOrder && this.remainingKeywords.length > 1) {
            this.promptForKeywordOrder();
            return false;
        }

        this.processRemainingInAutomaticOrder();

        return true;
    }

    promptForKeywordOrder() {
        let buttons = this.remainingKeywords.map(keyword => {
            return { text: GameKeywords[keyword].title, arg: keyword, method: 'chooseKeyword' };
        });
        this.game.promptWithMenu(this.firstPlayer, this, {
            activePrompt: {
                menuTitle: 'Choose keyword order',
                buttons: [
                    { text: 'Automatic', arg: 'automatic', method: 'chooseKeyword' }
                ].concat(sortBy(buttons, button => button.title))
            },
            waitingPromptTitle: 'Waiting for first player to choose keyword order'
        });
    }

    chooseKeyword(player, keyword) {
        if(keyword === 'automatic') {
            this.processRemainingInAutomaticOrder();
            return true;
        }

        this.applyKeyword(keyword);
        this.remainingKeywords = this.remainingKeywords.filter(k => k !== keyword);
        return true;
    }

    processRemainingInAutomaticOrder() {
        while(this.remainingKeywords.length !== 0) {
            let keyword = this.remainingKeywords[0];
            this.applyKeyword(keyword);
            this.remainingKeywords = this.remainingKeywords.slice(1);
        }
    }

    applyKeyword(keyword) {
        let ability = GameKeywords[keyword];
        let participantsWithKeyword = this.winnerCardsWithContext.filter(participant => ability.canResolve(participant.context));

        if(participantsWithKeyword.length === 0) {
            return;
        }

        if(this.challenge.winner.keywordSettings.chooseCards) {
            let cards = participantsWithKeyword.map(participant => participant.card);
            this.game.promptForSelect(this.challenge.winner, {
                mode: 'unlimited',
                ordered: true,
                activePromptTitle: 'Select ' + keyword + ' cards',
                cardCondition: card => cards.includes(card),
                onSelect: (player, selectedCards) => {
                    let finalParticipants = selectedCards.map(card => participantsWithKeyword.find(participant => participant.card === card));

                    this.resolveAbility(ability, finalParticipants);

                    return true;
                }
            });
        } else {
            this.resolveAbility(ability, participantsWithKeyword);
        }
    }
}

module.exports = ResolutionKeywordsWindow;
