import { sortBy } from '../../Array.js';
import ChallengeKeywordsWindow from './ChallengeKeywordsWindow.js';
import GameKeywords from '../gamekeywords.js';

const resolutionKeywords = ['insight', 'intimidate', 'pillage', 'renown'];

class ResolutionKeywordsWindow extends ChallengeKeywordsWindow {
    constructor(game, challenge) {
        super(game, challenge);
        this.cardsWithContext = this.buildContexts(challenge.getParticipants());
        this.firstPlayer = game.getFirstPlayer();
        this.remainingKeywords = resolutionKeywords;
    }

    continue() {
        if (!this.challenge.winner) {
            return true;
        }

        if (this.firstPlayer.keywordSettings.chooseOrder && this.remainingKeywords.length > 1) {
            this.promptForKeywordOrder();
            return false;
        }

        this.processRemainingInAutomaticOrder();

        return true;
    }

    promptForKeywordOrder() {
        let buttons = this.remainingKeywords.map((keyword) => {
            return { text: GameKeywords[keyword].title, arg: keyword, method: 'chooseKeyword' };
        });
        this.game.promptWithMenu(this.firstPlayer, this, {
            activePrompt: {
                menuTitle: 'Choose keyword order',
                buttons: [{ text: 'Automatic', arg: 'automatic', method: 'chooseKeyword' }].concat(
                    sortBy(buttons, (button) => button.title)
                )
            },
            waitingPromptTitle: 'Waiting for first player to choose keyword order'
        });
    }

    chooseKeyword(player, keyword) {
        if (keyword === 'automatic') {
            this.processRemainingInAutomaticOrder();
            return true;
        }

        this.applyKeyword(keyword);
        this.remainingKeywords = this.remainingKeywords.filter((k) => k !== keyword);
        return true;
    }

    processRemainingInAutomaticOrder() {
        while (this.remainingKeywords.length !== 0) {
            let keyword = this.remainingKeywords[0];
            this.applyKeyword(keyword);
            this.remainingKeywords = this.remainingKeywords.slice(1);
        }
    }

    applyKeyword(keyword) {
        let ability = GameKeywords[keyword];
        let participantsWithKeyword = this.cardsWithContext.filter(
            (participant) =>
                this.playerCanApply(participant.context, keyword) &&
                ability.canResolve(participant.context)
        );
        let players = [
            ...new Set(participantsWithKeyword.map((participant) => participant.card.controller))
        ];

        if (participantsWithKeyword.length === 0) {
            return;
        }

        for (const player of players) {
            if (player.keywordSettings.chooseCards) {
                let cards = participantsWithKeyword.map((participant) => participant.card);
                this.game.promptForSelect(player, {
                    mode: 'unlimited',
                    ordered: true,
                    activePromptTitle: 'Select ' + keyword + ' cards',
                    cardCondition: (card) => cards.includes(card),
                    onSelect: (player, selectedCards) => {
                        let finalParticipants = selectedCards.map((card) =>
                            participantsWithKeyword.find((participant) => participant.card === card)
                        );

                        this.resolveAbility(ability, finalParticipants);

                        return true;
                    }
                });
            } else {
                this.resolveAbility(ability, participantsWithKeyword);
            }
        }
    }

    playerCanApply(context, keyword) {
        const triggerablePlayer = context.game.triggerOnLosing[keyword]
            ? context.challenge.loser
            : context.challenge.winner;

        return context.player === triggerablePlayer;
    }
}

export default ResolutionKeywordsWindow;
