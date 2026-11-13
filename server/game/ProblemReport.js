import { randomUUID } from 'crypto';
import { MaxDescriptionLength, normaliseDescription } from '../../shared/problemReportLimits.js';

export { MaxDescriptionLength, normaliseDescription };
export const ProblemReportSchemaVersion = 2;
const MaxMessages = 300;
const MaxAbilityLogEntries = 200;

const uuids = (cards) => (cards || []).filter(Boolean).map((card) => card.uuid);

function cardRef(card) {
    return card ? { id: card.uuid, name: card.name } : undefined;
}

function safely(getValue, fallback) {
    try {
        return getValue();
    } catch {
        return fallback;
    }
}

function getCardState(card) {
    const isCharacter = card.getType?.() === 'character';

    return {
        id: card.uuid,
        code: card.cardData.code,
        name: card.name,
        packCode: card.cardData.packCode,
        type: card.getType?.(),
        owner: card.owner?.name,
        controller: card.controller?.name,
        location: card.location,
        parent: card.parent?.uuid,
        facedown: !!card.facedown,
        kneeled: !!card.kneeled,
        blank: safely(() => !!card.isAnyBlank?.(), false),
        participating: safely(() => !!card.isParticipating?.(), false),
        strength: isCharacter ? safely(() => card.getStrength(), undefined) : undefined,
        icons: isCharacter ? safely(() => card.getIcons(), undefined) : undefined,
        traits: safely(() => card.getTraits?.(), undefined),
        keywords: safely(() => card.getKeywords?.(), undefined),
        power: card.power,
        gold: card.gold,
        tokens: { ...card.tokens }
    };
}

function getPromptState(player) {
    const state = player.promptState.getState();

    return {
        ...state,
        selectableCards: uuids(player.getSelectableCards()),
        selectedCards: uuids(player.promptState.selectedCards)
    };
}

function getPlayerSettings(player) {
    return {
        promptedActionWindows: { ...player.promptedActionWindows },
        hideInterrupts: !!player.hideInterrupts,
        hideReactions: !!player.hideReactions,
        responsesPausedForPhase: !!player.responsesPausedForPhase,
        keywordSettings: { ...player.keywordSettings },
        promptDupes: !!player.promptDupes
    };
}

function getPlayerState(player, index, capture) {
    return {
        name: player.name,
        seat: index + 1,
        faction: player.faction.code,
        gold: player.gold,
        power: player.faction.getPower(),
        standing: player.standing,
        eliminated: player.eliminated,
        left: !!player.left,
        firstPlayer: !!player.firstPlayer,
        activePlot: player.activePlot?.uuid,
        plotDeck: uuids(player.plotDeck),
        usedPlots: uuids(player.plotDiscard),
        cardsInPlay: uuids(player.cardsInPlay),
        hand: uuids(player.hand),
        drawDeck: uuids(player.drawDeck),
        discardPile: uuids(player.discardPile),
        deadPile: uuids(player.deadPile),
        shadows: uuids(player.shadows),
        outOfGame: uuids(player.outOfGamePile),
        agendas: uuids(player.agendas),
        settings: capture(`players.${player.name}.settings`, () => getPlayerSettings(player)),
        prompt: capture(`players.${player.name}.prompt`, () => getPromptState(player))
    };
}

function getAbilityContext(context) {
    return {
        stage: context.resolutionStage,
        player: context.player?.name,
        source: cardRef(context.source),
        ability: context.ability?.title,
        event: context.event?.name,
        targets: safely(() => uuids(context.targets?.getTargets?.()), [])
    };
}

function getAbilityLog(game) {
    return game.logEntries.slice(-MaxAbilityLogEntries).map((entry) => ({
        type: entry.type,
        player: entry.player?.name,
        source: cardRef(entry.source),
        targets: uuids(entry.targets),
        results: (entry.results || []).map((result) => ({
            event: result.event,
            card: cardRef(result.card),
            player: result.player?.name,
            amount: result.amount
        })),
        at: game.gameChat.messages[entry.message]?.date
    }));
}

function getChallengeTurn(game) {
    const phase = game.pipeline.getCurrentStep();
    if (game.currentPhase !== 'challenge' || !Array.isArray(phase?.remainingPlayers)) {
        return undefined;
    }

    const remaining = phase.remainingPlayers;
    return {
        activePlayer: remaining[0]?.name,
        remainingPlayers: remaining.map((player) => player.name),
        finishedPlayers: game
            .getPlayersInFirstPlayerOrder()
            .filter((player) => !remaining.includes(player))
            .map((player) => player.name)
    };
}

function getActionWindow(game) {
    const window = game.currentActionWindow;

    return window
        ? { name: window.windowName, currentPlayer: window.currentPlayer?.name }
        : undefined;
}

function getCurrentChallenge(game) {
    const challenge = game.currentChallenge;

    return (
        challenge && {
            ...game.getChallengeSummary(challenge),
            stage: game.getChallengeStage(challenge),
            currentType: challenge.challengeType,
            declaredAttackers: uuids(challenge.declaredAttackers),
            attackers: uuids(challenge.attackers),
            declaredDefenders: uuids(challenge.declaredDefenders),
            defenders: uuids(challenge.defenders),
            attackerStrength: challenge.attackerStrength,
            defenderStrength: challenge.defenderStrength
        }
    );
}

// A report is often made because the game is in a broken state, and /cancel-prompt makes one
// before clearing a stuck step, so a part that throws is recorded rather than losing the report.
function createCapture(errors) {
    return (name, getValue, fallback) => {
        try {
            return getValue();
        } catch (error) {
            errors.push({ part: name, message: String(error?.message || error) });
            return fallback;
        }
    };
}

export function buildProblemReport(game, { reporter, source = 'report', description } = {}) {
    const captureErrors = [];
    const capture = createCapture(captureErrors);

    return {
        schemaVersion: ProblemReportSchemaVersion,
        id: randomUUID(),
        createdAt: new Date().toISOString(),
        reporter,
        source,
        description: normaliseDescription(description),
        game: capture(
            'game',
            () => ({
                id: game.id,
                name: game.name,
                format: game.gameFormat,
                variant: game.gameVariant,
                manualMode: game.manualMode.enabled,
                round: game.round,
                phase: game.currentPhase,
                firstPlayer: capture(
                    'game.firstPlayer',
                    () => game.getPlayersInFirstPlayerOrder()[0]?.name
                ),
                actionWindow: capture('game.actionWindow', () => getActionWindow(game)),
                challengeTurn: capture('game.challengeTurn', () => getChallengeTurn(game)),
                currentChallenge: capture('game.currentChallenge', () => getCurrentChallenge(game)),
                earlierChallenges: capture(
                    'game.earlierChallenges',
                    () =>
                        game.currentPhase === 'challenge'
                            ? game
                                  .getEarlierChallenges()
                                  .map((challenge) => game.getChallengeSummary(challenge))
                            : [],
                    []
                )
            }),
            { id: game.id, name: game.name, phase: game.currentPhase, round: game.round }
        ),
        players: capture(
            'players',
            () =>
                game.getAllPlayers().map((player, index) => getPlayerState(player, index, capture)),
            []
        ),
        abilityStack: capture(
            'abilityStack',
            () =>
                game.abilityContextStack
                    .filter((context) => context.resolutionStage !== 'framework')
                    .map(getAbilityContext),
            []
        ),
        abilityLog: capture('abilityLog', () => getAbilityLog(game), []),
        cards: capture('cards', () => game.allCards.map(getCardState), []),
        messages: capture('messages', () => game.gameChat.messages.slice(-MaxMessages), []),
        pipeline: capture('pipeline', () => game.pipeline.getDebugInfo()),
        captureErrors
    };
}
