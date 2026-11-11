import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class TheMadKingsCommand extends PlotCard {
    // The Mad King's Command (22030)
    // Forced Reaction: After the challenges phase begins, each player chooses up to 3 characters,
    // up to 3 locations, up to 3 attachments, and up to 3 cards in their hand and/or shadows area.
    // Place each card not chosen on the bottom of its owner's deck (cannot be saved).
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
                                formatForMessage(context.currentTargetSelection.value)
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
            message:
                "{player} uses {source} to place each card not chosen on the bottom of its owner's deck",
            gameAction: GameActions.simultaneously((context) =>
                cardsToMove(context).map((card) =>
                    GameActions.returnCardToDeck({ card, bottom: true, allowSave: false })
                )
            )
        });
    }
}

function cardsToMove(context) {
    const targets = context.targets.getTargets();
    return context.game.allCards.filter(
        (card) =>
            !targets.includes(card) &&
            (['hand', 'shadows'].includes(card.location) ||
                (card.location === 'play area' &&
                    ['character', 'location', 'attachment'].includes(card.getType())))
    );
}

function formatForMessage(cards) {
    const messageArray = [];
    const cardsFromPlay = cards.filter((card) => card.location === 'play area' && !card.facedown);
    if (cardsFromPlay.length !== 0) {
        messageArray.push(...cardsFromPlay);
    }

    const facedownAttachments = cards.filter(
        (card) => card.location === 'play area' && card.getType() === 'attachment' && card.facedown
    );
    if (facedownAttachments.length !== 0) {
        messageArray.push(
            `${facedownAttachments.length} facedown attachment${facedownAttachments.length > 1 ? 's' : ''}`
        );
    }

    const cardsFromHandOrShadows = cards.filter(
        (card) => card.location === 'hand' || card.location === 'shadows'
    );
    if (cardsFromHandOrShadows.length !== 0) {
        messageArray.push(
            `${cardsFromHandOrShadows.length} cards from their hand and/or shadows area`
        );
    }

    return messageArray;
}

TheMadKingsCommand.code = '22030';

export default TheMadKingsCommand;
