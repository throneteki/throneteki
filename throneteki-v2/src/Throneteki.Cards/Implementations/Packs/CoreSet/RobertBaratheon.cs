using Throneteki.Cards.Abilities;
using Throneteki.Domain.Events;

namespace Throneteki.Cards.Implementations.Packs.CoreSet;

/// <summary>
/// Robert Baratheon (01048) — 7 cost, STR X, Military + Power icons. Baratheon, King, Lord.
/// Persistent: Robert gains +1 STR for each other kneeled character in play.
/// Ported from: server/game/cards/01-Core/RobertBaratheon.js
/// </summary>
[CardDefinition("01048")]
public sealed class RobertBaratheon : CardScript
{
    protected override IEnumerable<CardAbilityDefinition> DeclareAbilities()
    {
        // Persistent dynamic strength effect
        // Handled by EffectEngine: StrengthModifierEffect computed on demand
        yield return AbilityBuilder.Persistent("robert-dynamic-str")
            .Describe("Robert gains +1 STR for each other kneeled character in play.")
            .Do(_ => Array.Empty<GameEvent>()) // EffectEngine computes this
            .Build();
    }
}
