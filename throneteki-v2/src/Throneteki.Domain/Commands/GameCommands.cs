using System.Collections.Immutable;
using Throneteki.Domain.Enums;

namespace Throneteki.Domain.Commands;

/// <summary>
/// Base for all player commands. Commands are the only way state changes.
/// </summary>
public abstract record GameCommand
{
    public Guid GameId { get; init; }
    public Guid PlayerId { get; init; }
    public DateTimeOffset Timestamp { get; init; } = DateTimeOffset.UtcNow;
}

/// <summary>System command to auto-advance phases that need no player input.</summary>
public record SystemAdvanceCommand : GameCommand;

// ── Setup / game start ──────────────────────────────────────────────────────
public record AssignDeckCommand(ImmutableList<DeckCard> DrawCards, ImmutableList<DeckCard> PlotCards, string FactionCode, string? AgendaCode) : GameCommand;
public record MulliganCommand(bool Mulligan) : GameCommand;

// ── Plot phase ──────────────────────────────────────────────────────────────
public record SelectPlotCommand(Guid CardInstanceId) : GameCommand;

// ── Draw phase ──────────────────────────────────────────────────────────────
// (Fully automated -- no player commands needed)

// ── Marshalling phase ───────────────────────────────────────────────────────
public record MarshalCardCommand(Guid CardInstanceId, Guid? AttachToId = null) : GameCommand;
public record MarshalAmbushCommand(Guid CardInstanceId) : GameCommand;
public record PlayEventCommand(Guid CardInstanceId) : GameCommand;
public record ClaimMarshallingDoneCommand : GameCommand;

// ── Challenges phase ────────────────────────────────────────────────────────
public record InitiateChallengeCommand(ChallengeIcon ChallengeType, Guid DefendingPlayerId) : GameCommand;
public record DeclareAttackersCommand(ImmutableList<Guid> AttackerIds) : GameCommand;
public record DeclareDefendersCommand(ImmutableList<Guid> DefenderIds) : GameCommand;
public record PassChallengesCommand : GameCommand;   // Player is done with their challenges

// ── Ability commands ────────────────────────────────────────────────────────
public record TriggerAbilityCommand(Guid CardInstanceId, string AbilityId) : GameCommand;
public record PassPriorityCommand : GameCommand;     // Pass in an ability window
public record SelectCardCommand(ImmutableList<Guid> CardInstanceIds) : GameCommand;
public record MenuChoiceCommand(string ChoiceId) : GameCommand;
public record DoneCommand : GameCommand;             // Confirm / "Done" in current context
public record ConcedCommand : GameCommand;

// ── Utility ─────────────────────────────────────────────────────────────────
public sealed record DeckCard(string CardCode, int Quantity);
