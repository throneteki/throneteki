const _ = require('underscore');

const AbilityContext = require('../AbilityContext.js');
const BaseStep = require('./basestep.js');
const GameKeywords = require('../gamekeywords.js');

const challengeKeywords = ['insight', 'intimidate', 'pillage', 'renown'];

class KeywordWindow extends BaseStep {
    constructor(game, challenge) {
        super(game);
        this.challenge = challenge;
        this.winnerCardsWithContext = _.map(challenge.getWinnerCards(), card => {
            return { card: card, context: new AbilityContext({ game: this.game, challenge: this.challenge, source: card }) };
        });
        this.firstPlayer = game.getFirstPlayer();
        this.remainingKeywords = challengeKeywords;
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
        let buttons = _.map(this.remainingKeywords, keyword => {
            return { text: GameKeywords[keyword].title, arg: keyword, method: 'chooseKeyword' };
        });
        this.game.promptWithMenu(this.firstPlayer, this, {
            activePrompt: {
                menuTitle: 'Choose keyword order',
                buttons: [
                    { text: 'Automatic', arg: 'automatic', method: 'chooseKeyword' }
                ].concat(_.sortBy(buttons, button => button.title))
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
        this.remainingKeywords = _.reject(this.remainingKeywords, k => k === keyword);
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
        let participantsWithKeyword = this.getParticipantsForKeyword(keyword, ability);

        if(participantsWithKeyword.length === 0) {
            return;
        }

        if(this.challenge.winner.keywordSettings.chooseCards) {
            let cards = _.pluck(participantsWithKeyword, 'card');
            this.game.promptForSelect(this.challenge.winner, {
                mode: 'unlimited',
                ordered: true,
                activePromptTitle: 'Select ' + keyword + ' cards',
                cardCondition: card => cards.includes(card),
                onSelect: (player, selectedCards) => {
                    let finalParticipants = _.map(selectedCards, card => _.find(participantsWithKeyword, participant => participant.card === card));

                    this.resolveAbility(ability, finalParticipants);
                    this.game.checkWinCondition(this.challenge.winner);

                    return true;
                }
            });
        } else {
            if(keyword === 'pillage' && _.size(participantsWithKeyword) > 1) {
                this.promptForPillageOrder(ability, participantsWithKeyword);
            } else {
                this.resolveAbility(ability, participantsWithKeyword);
            }

            this.game.checkWinCondition(this.challenge.winner);
        }
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
            mode: 'exactly',
            numCards: _.size(participants),
            activePromptTitle: 'Select order for pillage',
            cardCondition: card => cards.includes(card),
            onSelect: (player, selectedCards) => {
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
