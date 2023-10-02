const PlotCard = require('../../plotcard.js');
const GameActions = require('../../GameActions');

class TheMadKingsCommand extends PlotCard {
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                onPhaseStarted: event => event.phase === 'challenge'
            },
            target: {
                choosingPlayer: 'each',
                subTargets: {
                    character: {
                        optional: true,
                        ifAble: true,
                        numCards: 3,
                        activePromptTitle: 'Select up to 3 characters',
                        cardCondition: card => card.location === 'play area' && card.getType() === 'character'
                    },
                    attachment: {
                        optional: true,
                        ifAble: true,
                        numCards: 3,
                        activePromptTitle: 'Select up to 3 attachments',
                        cardCondition: card => card.location === 'play area' && card.getType() === 'attachment'
                    },
                    location: {
                        optional: true,
                        ifAble: true,
                        numCards: 3,
                        activePromptTitle: 'Select up to 3 locations',
                        cardCondition: card => card.location === 'play area' && card.getType() === 'location'
                    },
                    handShadows: {
                        optional: true,
                        ifAble: true,
                        numCards: 3,
                        activePromptTitle: 'Select up to 3 cards',
                        cardCondition: (card, context) => (card.location === 'hand' || card.location === 'shadows') && card.controller === context.choosingPlayer
                    }
                },
                messages: {
                    selected: {
                        format: '{targetSelection.choosingPlayer} chooses {formattedCards} for {source}',
                        args: { formattedCards: context => this.buildCardMessages(context.currentTargetSelection.value) }
                    },
                    unable: '{targetSelection.choosingPlayer} has no cards for {source}',
                    noneSelected: '{targetSelection.choosingPlayer} chooses no cards for {source}',
                    skipped: {
                        type: 'danger',
                        format: '{targetSelection.choosingPlayer} has cards to choose for {source} but did not choose any'
                    }
                }
            },
            handler: context => {
                this.promptPlayersForOrder(context.targets.selections);
            }
        });
    }

    promptPlayersForOrder(selections) {
        let potentialCards = this.game.allCards.filter(card => (
            card.allowGameAction('returnCardToDeck') && (
                ['hand', 'shadows'].includes(card.location) || 
                (card.location === 'play area' && ['character', 'location', 'attachment'].includes(card.getType()))
            )
        ));
        let selectedCards = selections.reduce((selectedCards, selection) => {
            return selectedCards.concat(selection.value || []);
        }, []);
        let toMove = potentialCards.filter(card => !selectedCards.includes(card));

        for(let player of this.game.getPlayersInFirstPlayerOrder()) {
            let cardsOwnedByPlayer = toMove.filter(card => card.owner === player);
            
            if(cardsOwnedByPlayer.length >= 2) {
                this.game.promptForSelect(player, {
                    ordered: true,
                    mode: 'exactly',
                    numCards: cardsOwnedByPlayer.length,
                    activePromptTitle: 'Select bottom deck order (last chosen ends up on bottom)',
                    cardCondition: card => cardsOwnedByPlayer.includes(card),
                    onSelect: (player, selectedCards) => {
                        toMove = toMove.filter(card => card.owner !== player).concat(selectedCards);

                        return true;
                    }
                });
            }
        }

        this.game.queueSimpleStep(() => {
            this.moveCardsToBottom(toMove);
        });
    }

    moveCardsToBottom(toMove) {
        let gameActions = [];

        for(let player of this.game.getPlayersInFirstPlayerOrder()) {
            let cardsOwnedByPlayer = toMove.filter(card => card.owner === player);

            if(cardsOwnedByPlayer.length !== 0) {
                for(let card of cardsOwnedByPlayer) {
                    // Detach any moving attachments first, so they dont get re-added to owners hand
                    card.attachments = card.attachments.filter(attachment => !toMove.includes(attachment));
                    
                    gameActions.push(GameActions.returnCardToDeck({ card, bottom: true, allowSave: false }));
                }

                this.game.addMessage('{0} moves {1} to the bottom of their deck for {2}', player, this.buildCardMessages(cardsOwnedByPlayer), this);
            } else {
                this.game.addMessage('{0} does not have any cards moved to the bottom of their deck for {1}',
                    player, this);
            }
        }

        this.game.resolveGameAction(GameActions.simultaneously(gameActions));
    }

    buildCardMessages(cards) {
        let messageArray = [];
        let cardsFromPlay = cards.filter(card => card.location === 'play area' && !card.facedown);
        if(cardsFromPlay.length !== 0) {
            messageArray.push(...cardsFromPlay);
        }

        let facedownAttachments = cards.filter(card => card.location === 'play area' && card.getType() === 'attachment' && card.facedown);
        if(facedownAttachments.length !== 0) {
            messageArray.push(`${facedownAttachments.length} facedown attachment${facedownAttachments.length > 1 ? 's' : ''}`);
        }

        let cardsFromHandOrShadows = cards.filter(card => card.location === 'hand' || card.location === 'shadows');
        if(cardsFromHandOrShadows.length !== 0) {
            messageArray.push(`${cardsFromHandOrShadows.length} cards from their hand and/or shadows area`);
        }

        return messageArray;
    }
}

TheMadKingsCommand.code = '22030';

module.exports = TheMadKingsCommand;
