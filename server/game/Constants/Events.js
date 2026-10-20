/**
 * Every event the engine raises, and the parameters it is raised with. Listeners may rely on each
 * parameter in `params` being present (though it may be undefined); those in `optional` are only
 * present on some of the paths that raise the event.
 *
 * Outside production, the game throws if code listens for or emits an event that is not listed
 * here, or emits one with parameters that don't match. Add an entry when adding an event.
 *
 * Triggered abilities listen with a window suffix (`onCardKneeled:reaction`), and aggregated
 * triggers receive `<name>:aggregate` events; both are checked against the base name.
 *
 * @typedef {{ params: Record<string, string>, optional?: Record<string, string> }} EventDefinition
 * @type {Readonly<Record<string, EventDefinition>>}
 */
export const Events = Object.freeze({
    afterChallenge: { params: { challenge: 'Challenge' } },
    onAddedToChallenge: { params: { card: 'DrawCard', challenge: 'Challenge', player: 'Player' } },
    onAtEndOfChallenge: { params: { challenge: 'Challenge' } },
    onAtEndOfPhase: { params: { phase: 'string' } },
    onAtEndOfRound: { params: { game: 'Game' } },
    onAttackersDeclared: {
        params: {
            cards: 'DrawCard[]',
            challenge: 'Challenge',
            numOfAttackingCharacters: 'number',
            player: 'Player'
        }
    },
    onBeforeDeckSearch: { params: { player: 'Player', source: 'BaseCard' } },
    onBeginRound: { params: { game: 'Game' } },
    onBypassedByStealth: {
        params: { challenge: 'Challenge', source: 'DrawCard', target: 'DrawCard' }
    },
    onCardAbilityInitiated: {
        params: {
            ability: 'BaseAbility',
            originalLocation: 'string',
            player: 'Player',
            source: 'BaseCard',
            targets: 'BaseCard[]',
            targetsToValidate: 'BaseCard[]'
        }
    },
    onCardAddedToHand: { params: { card: 'DrawCard' } },
    onCardAttached: { params: { attachment: 'DrawCard', target: 'BaseCard' } },
    onCardBlankToggled: { params: { card: 'BaseCard', isBlank: 'boolean' } },
    onCardDiscarded: {
        params: {
            allowSave: 'boolean',
            card: 'DrawCard',
            isPillage: 'boolean',
            isRandom: 'boolean',
            originalLocation: 'string',
            snapshotName: 'string',
            source: 'BaseCard'
        }
    },
    onCardDrawn: {
        params: { card: 'DrawCard', player: 'Player', reason: 'string', source: 'BaseCard' }
    },
    onCardEntersPlay: {
        params: { card: 'BaseCard', originalLocation: 'string', playingType: 'string' }
    },
    onCardKneeled: { params: { card: 'BaseCard', reason: 'string', source: 'BaseCard' } },
    onCardLeftPlay: {
        params: { allowSave: 'boolean', automaticSaveWithDupe: 'boolean', card: 'BaseCard' },
        optional: { cardStateWhenLeftPlay: 'object', player: 'Player', snapshotName: 'string' }
    },
    onCardMarshalled: {
        params: {
            card: 'DrawCard',
            originalController: 'Player',
            originalLocation: 'string',
            originalParent: 'DrawCard',
            player: 'Player',
            type: 'string',
            wasFacedownAttachment: 'boolean'
        }
    },
    onCardMoved: {
        params: {
            card: 'BaseCard',
            facedownChanged: 'boolean',
            newLocation: 'string',
            originalLocation: 'string',
            parentChanged: 'boolean'
        }
    },
    onCardOutOfShadows: {
        params: { card: 'DrawCard', player: 'Player', type: 'string' },
        optional: { xValue: 'number' }
    },
    onCardPlaced: {
        params: { card: 'BaseCard', location: 'string', player: 'Player' },
        optional: { bottom: 'boolean', orderable: 'boolean' }
    },
    onCardPlacedUnderneath: {
        params: { card: 'BaseCard', facedown: 'boolean', parentCard: 'BaseCard', player: 'Player' }
    },
    onCardPlayed: {
        params: {
            card: 'DrawCard',
            originalLocation: 'string',
            originalParent: 'DrawCard',
            player: 'Player'
        }
    },
    onCardPowerDiscarded: { params: { card: 'BaseCard', power: 'number' } },
    onCardPowerGained: { params: { card: 'BaseCard', power: 'number', reason: 'string' } },
    onCardPowerMoved: { params: { power: 'number', source: 'BaseCard', target: 'BaseCard' } },
    onCardPutIntoShadows: {
        params: {
            allowSave: 'boolean',
            card: 'DrawCard',
            player: 'Player',
            reason: 'string',
            snapshotName: 'string'
        }
    },
    onCardRemovedFromGame: {
        params: { allowSave: 'boolean', card: 'BaseCard', player: 'Player', snapshotName: 'string' }
    },
    onCardReturnedToDeck: {
        params: {
            allowSave: 'boolean',
            bottom: 'boolean',
            card: 'DrawCard',
            snapshotName: 'string'
        }
    },
    onCardReturnedToHand: {
        params: {
            allowSave: 'boolean',
            card: 'DrawCard',
            originalLocation: 'string',
            snapshotName: 'string'
        }
    },
    onCardRevealed: {
        params: {
            card: 'BaseCard',
            cardStateWhenRevealed: 'object',
            player: 'Player',
            source: 'BaseCard'
        }
    },
    onCardSaved: { params: { card: 'BaseCard' } },
    onCardStood: { params: { card: 'BaseCard' } },
    onCardStrengthChanged: { params: { amount: 'number', applying: 'boolean', card: 'DrawCard' } },
    onCardTakenControl: {
        params: {
            card: 'BaseCard',
            oldController: 'Player',
            player: 'Player',
            source: 'BaseCard'
        }
    },
    onCardsChosen: { params: { players: 'Player[]' } },
    onCardsDrawn: {
        params: {
            cards: 'DrawCard[]',
            length: 'number',
            player: 'Player',
            reason: 'string',
            source: 'BaseCard'
        },
        optional: { amount: 'number', desiredAmount: 'number' }
    },
    onCardsRevealed: {
        params: {
            cards: 'BaseCard[]',
            highlight: 'boolean',
            player: 'Player',
            revealWithMessage: 'boolean',
            source: 'BaseCard'
        }
    },
    onCardsShuffledIntoDeck: { params: { cards: 'DrawCard[]' } },
    onCardsSwitched: { params: { cards: 'BaseCard[]' } },
    onChallengeFinished: { params: { challenge: 'Challenge' } },
    onChallengeInitiated: { params: { challenge: 'Challenge' } },
    onChallengeRedirectable: { params: { challenge: 'Challenge' } },
    onCharacterKilled: {
        params: {
            allowSave: 'boolean',
            card: 'DrawCard',
            isBurn: 'boolean',
            player: 'Player',
            snapshotName: 'string'
        }
    },
    onChoosePlot: { params: { players: 'Player[]' } },
    onChoose: { params: {} },
    onClaimApplied: { params: { challenge: 'Challenge', claim: 'Claim', player: 'Player' } },
    onCompareInitiative: { params: { plots: 'PlotCard[]' } },
    onDeckSearched: {
        params: {
            numToSelect: 'number',
            player: 'Player',
            searchedPlayer: 'Player',
            title: 'string',
            topCards: 'number'
        }
    },
    onDeckShuffled: { params: { player: 'Player' } },
    onDecksPrepared: { params: {} },
    onDeclaredAsAttacker: { params: { card: 'DrawCard', challenge: 'Challenge' } },
    onDeclaredAsDefender: { params: { card: 'DrawCard', challenge: 'Challenge' } },
    onDefendersDeclared: {
        params: {
            cards: 'DrawCard[]',
            challenge: 'Challenge',
            numOfDefendingCharacters: 'number',
            player: 'Player'
        }
    },
    onDelayedEffectAdded: { params: { source: 'BaseCard' } },
    onDominanceDetermined: { params: {} },
    onDupeEntersPlay: { params: { card: 'DrawCard', target: 'DrawCard' } },
    onEffectsCanceled: { params: { canceledEvent: 'Event' } },
    onFirstPlayerDetermined: { params: { player: 'Player' } },
    onGoldGained: { params: { amount: 'number', desiredAmount: 'number', player: 'Player' } },
    onGoldReturned: { params: { amount: 'number', desiredAmount: 'number', player: 'Player' } },
    onGoldTransferred: {
        params: { amount: 'number', source: 'Player|BaseCard', target: 'Player|BaseCard' }
    },
    onIconGained: { params: { applying: 'boolean', card: 'DrawCard', icon: 'string' } },
    onIconLost: { params: { applying: 'boolean', card: 'DrawCard', icon: 'string' } },
    onIncomeCollected: { params: { player: 'Player' } },
    onInitiativeDetermined: { params: { winner: 'Player' } },
    onLastingEffectApplied: { params: { source: 'BaseCard' } },
    onLookAtDeck: {
        params: { amount: 'number', desiredAmount: 'number', lookingAt: 'Player', player: 'Player' }
    },
    onLookAtHand: { params: { opponent: 'Player', player: 'Player' } },
    onLookAtShadows: { params: { opponent: 'Player', player: 'Player' } },
    onPhaseEnded: { params: { phase: 'string' } },
    onPhaseStarted: { params: { phase: 'string' } },
    onPlayerKeepHandOrMulligan: { params: { choice: 'string', player: 'Player' } },
    onPlotDiscarded: { params: { card: 'PlotCard', player: 'Player' } },
    onPlotRevealed: { params: { plot: 'PlotCard' } },
    onPlotsRecycled: { params: { player: 'Player' } },
    onPlotsRevealed: { params: { plots: 'PlotCard[]' } },
    onRemovedFromChallenge: {
        params: {
            card: 'DrawCard',
            challenge: 'Challenge',
            isAttacking: 'boolean',
            isDeclared: 'boolean',
            isDefending: 'boolean',
            reason: 'string'
        }
    },
    onReserveChecked: { params: {} },
    onRoundEnded: { params: { game: 'Game' } },
    onSacrificed: { params: { card: 'BaseCard', player: 'Player', snapshotName: 'string' } },
    onSetupFinished: { params: {} },
    onTargetedByAssault: {
        params: { challenge: 'Challenge', source: 'DrawCard', target: 'DrawCard' }
    },
    onTargetsChosen: { params: { ability: 'BaseAbility', targets: 'ResolvedTargets' } },
    onTitlesEnteredPlay: { params: { titles: 'TitleCard[]' } },
    onTokenDiscarded: {
        params: { amount: 'number', card: 'BaseCard', desiredAmount: 'number', token: 'string' }
    },
    onTokenPlaced: {
        params: { amount: 'number', card: 'BaseCard', desiredAmount: 'number', token: 'string' }
    },
    onTopCardsDiscarded: {
        params: {
            amount: 'number',
            desiredAmount: 'number',
            isPillage: 'boolean',
            player: 'Player',
            source: 'BaseCard'
        }
    },
    onTraitNamed: { params: { player: 'Player' }, optional: { trait: 'string' } },
    onUnopposedGain: { params: { challenge: 'Challenge' } }
});

/**
 * Names the game emits or listens for that are not events from the catalogue: notifications
 * emitted with a plain payload, and the ability window types emitted as each window opens.
 */
export const Notifications = Object.freeze([
    'cancelinterrupt',
    'wouldinterrupt',
    'forcedinterrupt',
    'forcedreaction',
    'interrupt',
    'reaction',
    'whenrevealed',
    'onGameOver',
    'onPlayerEliminated',
    // Never raised; a limit that resets on it lasts for the whole game.
    'onGameEnded',
    'sendGameState'
]);
