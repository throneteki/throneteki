using System.Collections.Immutable;
using Throneteki.Domain.Enums;

namespace Throneteki.Domain.Models.GameAggregate;

public sealed record ChallengeState
{
    public required ChallengeIcon Type { get; init; }
    public required Guid AttackingPlayerId { get; init; }
    public required Guid DefendingPlayerId { get; init; }

    public ImmutableList<Guid> Attackers { get; init; } = ImmutableList<Guid>.Empty;
    public ImmutableList<Guid> Defenders { get; init; } = ImmutableList<Guid>.Empty;

    public bool AttackersDeclared { get; init; }
    public bool DefendersDeclared { get; init; }

    /// <summary>Computed at resolution time by EffectEngine.</summary>
    public int AttackerStrength { get; init; }
    public int DefenderStrength { get; init; }

    public Guid? WinnerId { get; init; }
    public bool IsUnopposed { get; init; }
    public int ChallengeNumber { get; init; }
    public bool IsResolved { get; init; }
}

public sealed record PromptState
{
    public required string PromptId { get; init; }
    public required Guid ActivePlayerId { get; init; }
    public required string Title { get; init; }
    public required PromptType PromptType { get; init; }

    public ImmutableList<PromptButton> Buttons { get; init; } = ImmutableList<PromptButton>.Empty;
    public ImmutableList<Guid> SelectableCardIds { get; init; } = ImmutableList<Guid>.Empty;
    public int MinSelect { get; init; } = 1;
    public int MaxSelect { get; init; } = 1;
    public string? WaitingMessage { get; init; }
}

public enum PromptType { SelectCard, MultiSelectCard, MenuChoice, SelectPlayer, Confirm }

public sealed record PromptButton(string Id, string Label, bool Disabled = false);

public sealed record PhaseContext
{
    public required GamePhase Phase { get; init; }
    public required string StepId { get; init; }
    public ImmutableDictionary<string, string> Data { get; init; } = ImmutableDictionary<string, string>.Empty;

    public PhaseContext WithData(string key, string value) =>
        this with { Data = Data.SetItem(key, value) };
    public string? GetData(string key) => Data.TryGetValue(key, out var v) ? v : null;
}

public sealed record AbilityWindowState
{
    public required AbilityWindowPhase WindowPhase { get; init; }
    public required string TriggeringEventId { get; init; }
    public ImmutableList<Guid> PlayersYetToPass { get; init; } = ImmutableList<Guid>.Empty;
    public ImmutableList<EligibleAbility> EligibleAbilities { get; init; } = ImmutableList<EligibleAbility>.Empty;
}

public enum AbilityWindowPhase
{
    CancelInterrupt, ForcedInterrupt, Interrupt,
    EventExecution,
    ForcedReaction, Reaction
}

public sealed record EligibleAbility(Guid SourceCardId, string AbilityId, Guid ControllingPlayerId, bool Forced);
