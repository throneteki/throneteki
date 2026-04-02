using System.Collections.Immutable;
using Throneteki.Domain.Enums;

namespace Throneteki.Domain.Models.GameAggregate;

/// <summary>
/// Represents a physical card instance within a game. Immutable.
/// Computed properties (effective strength, icons, keywords) are resolved by the EffectEngine.
/// </summary>
public sealed record CardInstance
{
    public required Guid InstanceId { get; init; }
    public required string CardCode { get; init; }
    public required Guid OwnerId { get; init; }
    public required Guid ControllerId { get; init; }
    public required CardLocation Location { get; init; }

    public bool Kneeled { get; init; }
    public bool FaceDown { get; init; }
    public int Power { get; init; }

    /// <summary>Base strength modifier from token effects (not persistent effects -- those are computed).</summary>
    public int StrengthModifier { get; init; }

    public ImmutableList<Guid> Attachments { get; init; } = ImmutableList<Guid>.Empty;
    public ImmutableList<Guid> Duplicates { get; init; } = ImmutableList<Guid>.Empty;
    public ImmutableDictionary<string, int> Tokens { get; init; } = ImmutableDictionary<string, int>.Empty;

    /// <summary>For attached cards / duplicates: the card this is attached to.</summary>
    public Guid? ParentId { get; init; }

    /// <summary>Used by ambush/bestow cost recording and other card-level flags.</summary>
    public ImmutableHashSet<string> Flags { get; init; } = ImmutableHashSet<string>.Empty;

    public CardInstance WithLocation(CardLocation loc) => this with { Location = loc };
    public CardInstance Kneel() => this with { Kneeled = true };
    public CardInstance Stand() => this with { Kneeled = false };
    public CardInstance AddPower(int amount) => this with { Power = Power + amount };
    public CardInstance AddDuplicate(Guid dupeId) => this with { Duplicates = Duplicates.Add(dupeId) };
    public CardInstance RemoveDuplicate(Guid dupeId) => this with { Duplicates = Duplicates.Remove(dupeId) };
    public CardInstance AddAttachment(Guid attachId) => this with { Attachments = Attachments.Add(attachId) };
    public CardInstance RemoveAttachment(Guid attachId) => this with { Attachments = Attachments.Remove(attachId) };
    public CardInstance SetFlag(string flag) => this with { Flags = Flags.Add(flag) };
    public CardInstance ClearFlag(string flag) => this with { Flags = Flags.Remove(flag) };
    public bool HasFlag(string flag) => Flags.Contains(flag);
}
