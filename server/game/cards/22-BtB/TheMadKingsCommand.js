const PlotCard = require('../../plotcard.js');
const GameActions = require('../../GameActions');
const Messages = require('../../Messages');

class TheMadKingsCommand extends PlotCard {
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                onPhaseStarted: event => event.phase === 'challenge'
            },
            targets: {
                character: {
                    choosingPlayer: 'each',
                    optional: true,
                    ifAble: true,
                    messages: Messages.eachPlayerTargetingForCardType('characters'),
                    numCards: 3,
                    activePromptTitle: 'Select up to 3 characters',
                    cardCondition: card => card.location === 'play area' && card.getType() === 'character'
                },
                attachment: {
                    choosingPlayer: 'each',
                    optional: true,
                    ifAble: true,
                    messages: Messages.eachPlayerTargetingForCardType('attachments'),
                    numCards: 3,
                    activePromptTitle: 'Select up to 3 attachments',
                    cardCondition: card => card.location === 'play area' && card.getType() === 'attachment'
                },
                location: {
                    choosingPlayer: 'each',
                    optional: true,
                    ifAble: true,
                    messages: Messages.eachPlayerTargetingForCardType('locations'),
                    numCards: 3,
                    activePromptTitle: 'Select up to 3 locations',
                    cardCondition: card => card.location === 'play area' && card.getType() === 'location'
                },
                hand_shadows: {
                    choosingPlayer: 'each',
                    optional: true,
                    ifAble: true,
                    messages: Messages.eachPlayerSecretTargetingForCardType('cards in hand and/or shadows'),
                    numCards: 3,
                    activePromptTitle: 'Select up to 3 cards',
                    cardCondition: (card, context) => (card.location === 'hand' || card.location === 'shadows') && card.controller === context.choosingPlayer
                }
            },
            handler: context => {
                this.promptPlayersForOrder(context.targets.selections);
            }
        });
    }

    promptPlayersForOrder(selections) {
        let toMove = [];
        let validInPlayTypes = ['character', 'attachment', 'location'];

        for(let selection of selections) {
            let player = selection.choosingPlayer;
            let selectedCards = selection.value || [];
            let selectionTargets = selection.name.split('_');
            // Selections (above) can be grouped by underscores. This splits those groups into their own comparisons
            for(let selectionTarget of selectionTargets) {
                let targetLocation = validInPlayTypes.includes(selectionTarget) ? 'play area' : selectionTarget;
                let cardsInLocation = this.game.allCards.filter(card => card.controller === player 
                    && card.location === targetLocation // checking location
                    && (validInPlayTypes.includes(selectionTarget) ? card.getType() === selectionTarget : true) // checking type, if applicable
                    && card.allowGameAction('returnCardToDeck')); // checking return to deck
                let playerSpecificToMove = cardsInLocation.filter(card => !selectedCards.includes(card));
                toMove = toMove.concat(playerSpecificToMove);
            }
        }

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

                let cardsFromPlay = cardsOwnedByPlayer.filter(card => card.location === 'play area' && !card.facedown);
                let cardsMoved = [];
                if(cardsFromPlay.length !== 0) {
                    cardsMoved.push(...cardsFromPlay);
                }

                let facedownAttachments = cardsOwnedByPlayer.filter(card => card.location === 'play area' && card.getType() === 'attachment' && card.facedown);
                if(facedownAttachments.length !== 0) {
                    cardsMoved.push(`${facedownAttachments.length} facedown attachment${facedownAttachments.length > 1 ? 's' : ''}`);
                }

                let cardsFromHandOrShadows = cardsOwnedByPlayer.filter(card => card.location === 'hand' || card.location === 'shadows');
                if(cardsFromHandOrShadows.length !== 0) {
                    cardsMoved.push(`${cardsFromHandOrShadows.length} cards from their hand and/or shadows area`);
                }

                this.game.addMessage('{0} moves {1} to the bottom of their deck for {2}', player, cardsMoved, this);
            } else {
                this.game.addMessage('{0} does not have any cards moved to the bottom of their deck for {1}',
                    player, this);
            }
        }

        this.game.resolveGameAction(GameActions.simultaneously(gameActions));
    }
}

TheMadKingsCommand.code = '22030';

module.exports = TheMadKingsCommand;
