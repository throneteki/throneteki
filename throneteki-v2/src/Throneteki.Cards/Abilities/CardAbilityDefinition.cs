using System.Collections.Immutable;
using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;
using Throneteki.Domain.Models.GameAggregate;

namespace Throneteki.Cards.Abilities;

/// <summary>
/// The type of ability — determines when it can be triggered.
/// </summary>
public enum AbilityType
{
    /// <summary>Persistent/lasting effect while the card is in play.</summary>
    Persistent,
    /// <summary>Can be triggered once per phase/round window.</summary>
    Action,
    /// <summary>Fires automatically on a specific trigger event.</summary>
    Reaction,
    /// <summary>Fires before a trigger and can cancel it.</summary>
    Interrupt,
    /// <summary>Fires when a plot is revealed.</summary>
    WhenRevealed,
    /// <summary>Fires when the card enters play (marshalled).</summary>
    Constant,
}

/// <summary>
/// Execution context passed to all ability delegates.
/// </summary>
public sealed class AbilityContext
{
    public required GameState State { get; init; }
    public required CardInstance Source { get; init; }
    public required Guid ControllingPlayerId { get; init; }

    /// <summary>The event that triggered this ability (for reactions/interrupts).</summary>
    public GameEvent? TriggeringEvent { get; init; }

    /// <summary>Optional target card selected by the player.</summary>
    public CardInstance? Target { get; init; }
}

/// <summary>
/// The outcome of resolving an ability: a list of game events to emit.
/// </summary>
public delegate IReadOnlyList<GameEvent> AbilityEffect(AbilityContext context);

/// <summary>
/// A condition that must be true for an ability to be playable/triggered.
/// </summary>
public delegate bool AbilityCondition(AbilityContext context);

/// <summary>
/// A predicate on a game event — used by reactions/interrupts to match trigger events.
/// </summary>
public delegate bool EventFilter(GameEvent @event, GameState state);

/// <summary>
/// Immutable descriptor for a single card ability.
/// All card-specific logic is expressed as pure functions in this record.
/// </summary>
public sealed record CardAbilityDefinition
{
    public required string AbilityId { get; init; }
    public required AbilityType Type { get; init; }

    /// <summary>
    /// For reactions and interrupts: the event types this ability fires on.
    /// Empty for actions and persistent effects.
    /// </summary>
    public ImmutableList<EventFilter> TriggerFilters { get; init; } = ImmutableList<EventFilter>.Empty;

    /// <summary>Whether this ability can currently be triggered.</summary>
    public AbilityCondition? Condition { get; init; }

    /// <summary>The actual effect: emits game events.</summary>
    public required AbilityEffect Effect { get; init; }

    /// <summary>For actions: the gold cost to play this ability.</summary>
    public int GoldCost { get; init; }

    /// <summary>Whether a target must be selected before resolving.</summary>
    public bool RequiresTarget { get; init; }

    /// <summary>Filter for valid targets (when RequiresTarget = true).</summary>
    public Func<GameState, CardInstance, CardInstance, bool>? TargetFilter { get; init; }

    /// <summary>Max number of times per round this ability can trigger (0 = unlimited).</summary>
    public int MaxUsesPerRound { get; init; } = 1;

    /// <summary>Human-readable description.</summary>
    public string Description { get; init; } = "";
}
