using Throneteki.Cards.Abilities;
using Throneteki.Domain.Events;

namespace Throneteki.Cards.Implementations.Packs.CoreSet;

/// <summary>
/// Balon Greyjoy (01068) — 6 cost, 5 STR, Military + Power icons. Greyjoy, Ironborn, Lord.
/// Stealth keyword.
/// Persistent: While Balon is attacking, each defending character with lower STR
/// does not contribute its STR to the challenge.
/// Ported from: server/game/cards/01-Core/BalonGreyjoy.js
/// </summary>
[CardDefinition("01068")]
public sealed class BalonGreyjoy : CardScript
{
    protected override IEnumerable<CardAbilityDefinition> DeclareAbilities()
    {
        // Persistent: while attacking, defenders with lower STR don't contribute
        // Handled by EffectEngine at strength computation
        yield return AbilityBuilder.Persistent("balon-suppress-defenders")
            .Describe("While Balon is attacking, defending characters with lower STR do not contribute STR.")
            .Do(_ => Array.Empty<GameEvent>()) // EffectEngine handles this
            .Build();
    }
}
