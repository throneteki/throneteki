using Throneteki.Cards.Abilities;
using Throneteki.Domain.Events;

namespace Throneteki.Cards.Implementations.Packs.CoreSet;

/// <summary>
/// Stannis Baratheon (01052) — 5 cost, 4 STR, Military + Power icons. Baratheon, King, Lord.
/// Persistent: Each player cannot stand more than 2 characters during the Standing phase.
/// Ported from: server/game/cards/01-Core/StannisBaratheon.js
/// </summary>
[CardDefinition("01052")]
public sealed class StannisBaratheon : CardScript
{
    protected override IEnumerable<CardAbilityDefinition> DeclareAbilities()
    {
        // Persistent: limits standing to 2 characters per player
        // Handled by EffectEngine/StandingPhase restriction
        yield return AbilityBuilder.Persistent("stannis-stand-limit")
            .Describe("Each player cannot stand more than 2 characters during the Standing phase.")
            .Do(_ => Array.Empty<GameEvent>()) // EffectEngine handles the restriction
            .Build();
    }
}
