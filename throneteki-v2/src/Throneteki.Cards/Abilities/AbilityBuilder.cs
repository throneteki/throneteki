using System.Collections.Immutable;
using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;
using Throneteki.Domain.Models.GameAggregate;

namespace Throneteki.Cards.Abilities;

/// <summary>
/// Fluent DSL for defining card abilities.
/// Usage:
///   Ability.Action("draw-card")
///       .Costs(1)
///       .When(ctx => ctx.State.Phase == GamePhase.Marshalling)
///       .Do(ctx => new[] { new CardDrawnEvent(...) })
///       .Build()
/// </summary>
public sealed class AbilityBuilder
{
    private readonly string _abilityId;
    private AbilityType _type;
    private readonly List<EventFilter> _triggerFilters = new();
    private AbilityCondition? _condition;
    private AbilityEffect? _effect;
    private int _goldCost;
    private bool _requiresTarget;
    private Func<GameState, CardInstance, CardInstance, bool>? _targetFilter;
    private int _maxUsesPerRound = 1;
    private string _description = "";

    private AbilityBuilder(string abilityId, AbilityType type)
    {
        _abilityId = abilityId;
        _type = type;
    }

    // ── Factory methods ───────────────────────────────────────────────────────

    public static AbilityBuilder Action(string abilityId) => new(abilityId, AbilityType.Action);
    public static AbilityBuilder Reaction(string abilityId) => new(abilityId, AbilityType.Reaction);
    public static AbilityBuilder Interrupt(string abilityId) => new(abilityId, AbilityType.Interrupt);
    public static AbilityBuilder WhenRevealed(string abilityId) => new(abilityId, AbilityType.WhenRevealed);
    public static AbilityBuilder Persistent(string abilityId) => new(abilityId, AbilityType.Persistent);
    public static AbilityBuilder Constant(string abilityId) => new(abilityId, AbilityType.Constant);

    // ── Fluent configuration ──────────────────────────────────────────────────

    /// <summary>Sets the gold cost to trigger this ability.</summary>
    public AbilityBuilder Costs(int gold) { _goldCost = gold; return this; }

    /// <summary>Adds a condition that must be true for the ability to be available.</summary>
    public AbilityBuilder When(AbilityCondition condition)
    {
        var prev = _condition;
        _condition = prev == null ? condition : ctx => prev(ctx) && condition(ctx);
        return this;
    }

    /// <summary>Restricts the ability to a specific phase.</summary>
    public AbilityBuilder DuringPhase(GamePhase phase) =>
        When(ctx => ctx.State.Phase == phase);

    /// <summary>Adds an event-type trigger filter (for reactions/interrupts).</summary>
    public AbilityBuilder OnEvent<T>(Func<T, GameState, bool>? filter = null) where T : GameEvent
    {
        _triggerFilters.Add((@event, state) =>
            @event is T t && (filter == null || filter(t, state)));
        return this;
    }

    /// <summary>Requires the player to select a valid target before resolving.</summary>
    public AbilityBuilder TargetCard(Func<GameState, CardInstance, CardInstance, bool> filter)
    {
        _requiresTarget = true;
        _targetFilter = filter;
        return this;
    }

    /// <summary>Limits how many times per round this ability can fire.</summary>
    public AbilityBuilder LimitPerRound(int max) { _maxUsesPerRound = max; return this; }

    /// <summary>Unlimited uses per round.</summary>
    public AbilityBuilder Unlimited() { _maxUsesPerRound = 0; return this; }

    /// <summary>Sets a human-readable description.</summary>
    public AbilityBuilder Describe(string description) { _description = description; return this; }

    /// <summary>Sets the effect delegate that produces game events.</summary>
    public AbilityBuilder Do(AbilityEffect effect) { _effect = effect; return this; }

    /// <summary>Convenience: emit a fixed list of events.</summary>
    public AbilityBuilder Do(Func<AbilityContext, IEnumerable<GameEvent>> effect) =>
        Do(ctx => effect(ctx).ToList());

    // ── Build ─────────────────────────────────────────────────────────────────

    public CardAbilityDefinition Build()
    {
        if (_effect == null)
            throw new InvalidOperationException($"Ability '{_abilityId}' has no effect. Call .Do(...).");

        return new CardAbilityDefinition
        {
            AbilityId = _abilityId,
            Type = _type,
            TriggerFilters = _triggerFilters.ToImmutableList(),
            Condition = _condition,
            Effect = _effect,
            GoldCost = _goldCost,
            RequiresTarget = _requiresTarget,
            TargetFilter = _targetFilter,
            MaxUsesPerRound = _maxUsesPerRound,
            Description = _description,
        };
    }
}
