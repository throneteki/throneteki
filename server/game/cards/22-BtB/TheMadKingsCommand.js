const PlotCard = require('../../plotcard.js');
const GameActions = require('../../GameActions');

class TheMadKingsCommand extends PlotCard {
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                onPhaseStarted: (event) => event.phase === 'challenge'
            },
            target: {
                choosingPlayer: 'each',
                subTargets: {
                    character: {
                        optional: true,
                        ifAble: true,
                        numCards: 3,
                        activePromptTitle: 'Select up to 3 characters',
                        cardCondition: (card) =>
                            card.location === 'play area' && card.getType() === 'character'
                    },
                    attachment: {
                        optional: true,
                        ifAble: true,
                        numCards: 3,
                        activePromptTitle: 'Select up to 3 attachments',
                        cardCondition: (card) =>
                            card.location === 'play area' && card.getType() === 'attachment'
                    },
                    location: {
                        optional: true,
                        ifAble: true,
                        numCards: 3,
                        activePromptTitle: 'Select up to 3 locations',
                        cardCondition: (card) =>
                            card.location === 'play area' && card.getType() === 'location'
                    },
                    handShadows: {
                        optional: true,
                        ifAble: true,
                        numCards: 3,
                        activePromptTitle: 'Select up to 3 cards',
                        cardCondition: (card, context) =>
                            (card.location === 'hand' || card.location === 'shadows') &&
                            card.controller === context.choosingPlayer
                    }
                },
                messages: {
                    selected: {
                        format: '{targetSelection.choosingPlayer} chooses {formattedCards} for {source}',
                        args: {
                            formattedCards: (context) =>
                                this.formatForMessage(context.currentTargetSelection.value)
                        }
                    },
                    unable: '{targetSelection.choosingPlayer} has no cards for {source}',
                    noneSelected: '{targetSelection.choosingPlayer} chooses no cards for {source}',
                    skipped: {
                        type: 'danger',
                        format: '{targetSelection.choosingPlayer} has cards to choose for {source} but did not choose any'
                    }
                }
            },
            message: (context) => {
                const toBeMoved = this.toBeMoved(context);
                context.targets.selections
                    .map((selection) => selection.choosingPlayer)
                    .forEach((player) => {
                        const cards = toBeMoved.filter((card) => card.owner === player);
                        if (cards.length > 0) {
                            this.game.addMessage(
                                '{0} places {1} on the bottom of their deck for {2}',
                                player,
                                this.formatForMessage(cards),
                                context.source
                            );
                        } else {
                            this.game.addMessage(
                                '{0} does not have any cards placed on the bottom of their deck for {1}',
                                player,
                                context.source
                            );
                        }
                    });
            },
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.simultaneously(
                        this.toBeMoved(context).map((card) =>
                            GameActions.returnCardToDeck({ card, bottom: true, allowSave: false })
                        )
                    )
                );
            }
        });
    }

    toBeMoved(context) {
        const targets = context.targets.getTargets();
        return this.game.allCards.filter(
            (card) =>
                !targets.includes(card) &&
                (['hand', 'shadows'].includes(card.location) ||
                    (card.location === 'play area' &&
                        ['character', 'location', 'attachment'].includes(card.getType())))
        );
    }

    formatForMessage(cards) {
        let messageArray = [];
        let cardsFromPlay = cards.filter((card) => card.location === 'play area' && !card.facedown);
        if (cardsFromPlay.length !== 0) {
            messageArray.push(...cardsFromPlay);
        }

        let facedownAttachments = cards.filter(
            (card) =>
                card.location === 'play area' && card.getType() === 'attachment' && card.facedown
        );
        if (facedownAttachments.length !== 0) {
            messageArray.push(
                `${facedownAttachments.length} facedown attachment${facedownAttachments.length > 1 ? 's' : ''}`
            );
        }

        let cardsFromHandOrShadows = cards.filter(
            (card) => card.location === 'hand' || card.location === 'shadows'
        );
        if (cardsFromHandOrShadows.length !== 0) {
            messageArray.push(
                `${cardsFromHandOrShadows.length} cards from their hand and/or shadows area`
            );
        }

        return messageArray;
    }
}

TheMadKingsCommand.code = '22030';

module.exports = TheMadKingsCommand;
