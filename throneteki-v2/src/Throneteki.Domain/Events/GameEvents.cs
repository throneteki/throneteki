using System.Collections.Immutable;
using Throneteki.Domain.Enums;
using Throneteki.Domain.Models.GameAggregate;

namespace Throneteki.Domain.Events;

/// <summary>
/// Base for all game events. Events are immutable facts -- the game's source of truth.
/// </summary>
public abstract record GameEvent
{
    public Guid EventId { get; init; } = Guid.NewGuid();
    public int SequenceNumber { get; init; }
    public DateTimeOffset Timestamp { get; init; } = DateTimeOffset.UtcNow;
}

// ── Game lifecycle ──────────────────────────────────────────────────────────
public record GameCreatedEvent(GameFormat Format, ImmutableList<Guid> PlayerIds) : GameEvent;
public record GameStartedEvent(long InitialRandomSeed) : GameEvent;
public record GameEndedEvent(Guid? WinnerId, string Reason) : GameEvent;

// ── Phase / round ───────────────────────────────────────────────────────────
public record RoundStartedEvent(int RoundNumber) : GameEvent;
public record PhaseStartedEvent(GamePhase Phase) : GameEvent;
public record PhaseEndedEvent(GamePhase Phase) : GameEvent;
public record FirstPlayerDeterminedEvent(Guid PlayerId) : GameEvent;
public record PhaseContextUpdatedEvent(string StepId, ImmutableDictionary<string, string>? Data = null) : GameEvent;

// ── Deck setup ──────────────────────────────────────────────────────────────
public record DeckAssignedEvent(Guid PlayerId, ImmutableList<Models.GameAggregate.CardInstance> AllCards) : GameEvent;
public record DeckShuffledEvent(Guid PlayerId, ImmutableList<Guid> NewOrder, long SeedUsed) : GameEvent;

// ── Card movement ───────────────────────────────────────────────────────────
public record CardDrawnEvent(Guid PlayerId, Guid CardInstanceId) : GameEvent;
public record CardMarshalledEvent(Guid PlayerId, Guid CardInstanceId, int GoldSpent) : GameEvent;
public record CardEnteredPlayEvent(Guid PlayerId, Guid CardInstanceId) : GameEvent;
public record CardLeftPlayEvent(Guid CardInstanceId, CardLocation Destination) : GameEvent;
public record CardDiscardedEvent(Guid CardInstanceId, Guid OwnerId, CardLocation FromLocation) : GameEvent;
public record CardKilledEvent(Guid CardInstanceId, Guid OwnerId) : GameEvent;
public record CardReturnedToHandEvent(Guid CardInstanceId, Guid OwnerId) : GameEvent;
public record CardPutInShadowsEvent(Guid CardInstanceId, Guid OwnerId) : GameEvent;
public record CardMovedEvent(Guid CardInstanceId, CardLocation From, CardLocation To) : GameEvent;

// ── Card state ──────────────────────────────────────────────────────────────
public record CardKneeledEvent(Guid CardInstanceId, string Reason = "") : GameEvent;
public record CardStoodEvent(Guid CardInstanceId) : GameEvent;
public record CardAttachedEvent(Guid AttachmentId, Guid ParentCardId) : GameEvent;
public record AttachmentRemovedEvent(Guid AttachmentId, Guid ParentCardId) : GameEvent;
public record DuplicatePlacedEvent(Guid DuplicateCardId, Guid ParentCardId) : GameEvent;
public record DuplicateSacrificedEvent(Guid DuplicateCardId, Guid ParentCardId) : GameEvent;
public record CardFacedownChangedEvent(Guid CardInstanceId, bool FaceDown) : GameEvent;

// ── Resources ───────────────────────────────────────────────────────────────
public record GoldGainedEvent(Guid PlayerId, int Amount, string Reason = "") : GameEvent;
public record GoldSpentEvent(Guid PlayerId, int Amount, string Reason = "") : GameEvent;
public record PowerGainedEvent(Guid TargetId, PowerTargetType TargetType, int Amount, string Reason = "") : GameEvent;
public record PowerLostEvent(Guid TargetId, PowerTargetType TargetType, int Amount) : GameEvent;
public record PowerMovedEvent(Guid FromCardId, Guid ToCardId, int Amount) : GameEvent;
public record TokenAddedEvent(Guid CardInstanceId, string TokenType, int Amount) : GameEvent;
public record TokenRemovedEvent(Guid CardInstanceId, string TokenType, int Amount) : GameEvent;

// ── Plot phase ──────────────────────────────────────────────────────────────
public record PlotSelectedEvent(Guid PlayerId, Guid CardInstanceId) : GameEvent;
public record PlotRevealedEvent(Guid PlayerId, Guid CardInstanceId) : GameEvent;
public record InitiativeWonEvent(Guid PlayerId) : GameEvent;

// ── Challenges ──────────────────────────────────────────────────────────────
public record ChallengeInitiatedEvent(ChallengeIcon ChallengeType, Guid AttackingPlayerId, Guid DefendingPlayerId, int ChallengeNumber) : GameEvent;
public record AttackersDeclaredEvent(ImmutableList<Guid> AttackerCardIds) : GameEvent;
public record DefendersDeclaredEvent(ImmutableList<Guid> DefenderCardIds) : GameEvent;
public record ChallengeStrengthCalculatedEvent(int AttackerStrength, int DefenderStrength) : GameEvent;
public record ChallengeResultDeterminedEvent(Guid? WinnerId, bool Unopposed, int WinnerStrength, int LoserStrength) : GameEvent;
public record ClaimAppliedEvent(ChallengeIcon ChallengeType, int ClaimValue, Guid LosingPlayerId) : GameEvent;
public record ChallengePassedEvent(Guid PlayerId) : GameEvent;   // Player chose not to initiate

// ── Dominance ───────────────────────────────────────────────────────────────
public record DominanceWonEvent(Guid PlayerId) : GameEvent;
public record DominanceTiedEvent : GameEvent;

// ── Abilities ───────────────────────────────────────────────────────────────
public record AbilityInitiatedEvent(Guid SourceCardId, string AbilityId, Guid PlayerId) : GameEvent;
public record AbilityResolvedEvent(Guid SourceCardId, string AbilityId) : GameEvent;
public record AbilityCancelledEvent(Guid SourceCardId, string AbilityId, string Reason = "") : GameEvent;
public record AbilityWindowOpenedEvent(AbilityWindowPhase WindowPhase, string TriggeringEventId) : GameEvent;
public record AbilityWindowClosedEvent(AbilityWindowPhase WindowPhase) : GameEvent;
public record PlayerPassedPriorityEvent(Guid PlayerId) : GameEvent;

// ── Prompts ─────────────────────────────────────────────────────────────────
public record PromptIssuedEvent(Guid PlayerId, PromptState Prompt) : GameEvent;
public record PromptResolvedEvent(Guid PlayerId, string PromptId) : GameEvent;

// ── Log ─────────────────────────────────────────────────────────────────────
public record GameMessageEvent(string Message) : GameEvent;
