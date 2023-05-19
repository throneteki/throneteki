const {sortBy} = require('../../Array');

const AbilityContext = require('../AbilityContext.js');
const BaseStep = require('./basestep.js');
const GameKeywords = require('../gamekeywords.js');

const challengeKeywords = ['insight', 'intimidate', 'pillage', 'renown'];

class KeywordWindow extends BaseStep {
    constructor(game, challenge) {
        super(game);
        this.challenge = challenge;
        this.winnerCardsWithContext = challenge.getWinnerCards().map(card => {
            return { card: card, context: new AbilityContext({ player: this.challenge.winner, game: this.game, challenge: this.challenge, source: card }) };
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
        let participantsWithKeyword = this.getParticipantsForKeyword(keyword, ability);

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
            if(keyword === 'pillage' && participantsWithKeyword.length > 1) {
                this.promptForPillageOrder(ability, participantsWithKeyword);
            } else {
                this.resolveAbility(ability, participantsWithKeyword);
            }
        }
    }

    getParticipantsForKeyword(keyword, ability) {
        let participants = this.winnerCardsWithContext.filter(participant => {
            return participant.card.hasKeyword(keyword) && ability.meetsRequirements(participant.context);
        });

        if(keyword === 'intimidate' && participants.length > 0) {
            return [participants[0]];
        }

        return participants;
    }

    promptForPillageOrder(ability, participants) {
        let cards = participants.map(participant => participant.card);
        this.game.promptForSelect(this.challenge.winner, {
            ordered: true,
            mode: 'exactly',
            numCards: participants.length,
            activePromptTitle: 'Select order for pillage',
            cardCondition: card => cards.includes(card),
            onSelect: (player, selectedCards) => {
                let finalParticipants = selectedCards.map(card => participants.find(participant => participant.card === card));

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
        for(let participant of participants) {
            this.game.resolveAbility(ability, participant.context);
        }
    }
}

module.exports = KeywordWindow;
