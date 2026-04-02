using Throneteki.Cards.Abilities;
using Throneteki.Domain.Events;

namespace Throneteki.Cards.Implementations.Packs.CoreSet;

/// <summary>
/// The Iron Throne (01038) — Baratheon location, 2 cost.
/// Persistent: Your revealed plot card gains +1 reserve.
/// Persistent: The Iron Throne contributes 8 STR to your dominance total.
/// Ported from: server/game/cards/01-Core/TheIronThrone.js
/// </summary>
[CardDefinition("01038")]
public sealed class IronThrone : CardScript
{
    protected override IEnumerable<CardAbilityDefinition> DeclareAbilities()
    {
        // Plot modifier: +1 reserve (handled by EffectEngine)
        yield return AbilityBuilder.Persistent("iron-throne-reserve")
            .Describe("Your revealed plot card gains +1 reserve.")
            .Do(_ => Array.Empty<GameEvent>()) // EffectEngine handles this
            .Build();

        // Persistent: +8 dominance strength (handled by Dominance phase calculation)
        yield return AbilityBuilder.Persistent("iron-throne-dominance")
            .Describe("The Iron Throne contributes 8 STR to your dominance total.")
            .Do(_ => Array.Empty<GameEvent>()) // Dominance phase calculation handles this
            .Build();
    }
}
