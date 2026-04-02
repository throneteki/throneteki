using Throneteki.Cards.Abilities;
using Throneteki.Domain.Events;

namespace Throneteki.Cards.Implementations.Packs.CoreSet;

/// <summary>
/// Catelyn Stark (01143) — 5 cost, 4 STR, Intrigue + Power icons. Stark, Lady.
/// Persistent: While Catelyn is participating in a challenge, the opponent cannot
/// trigger card abilities.
/// Ported from: server/game/cards/01-Core/CatelynStark.js
/// </summary>
[CardDefinition("01143")]
public sealed class CatelynStark : CardScript
{
    protected override IEnumerable<CardAbilityDefinition> DeclareAbilities()
    {
        // Persistent: while participating, opponent cannot trigger card abilities
        // Handled by EffectEngine: RestrictionEffect on opponent when Catelyn is participating
        yield return AbilityBuilder.Persistent("catelyn-suppress")
            .Describe("While Catelyn is participating, the opponent cannot trigger card abilities.")
            .Do(_ => Array.Empty<GameEvent>()) // EffectEngine handles restriction
            .Build();
    }
}
