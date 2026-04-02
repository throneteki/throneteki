using Throneteki.Cards.Abilities;
using Throneteki.Domain.Events;

namespace Throneteki.Cards.Implementations.Packs.CoreSet;

/// <summary>
/// Cersei Lannister (01084) — 4 cost, 4 STR, Intrigue + Power icons. Lannister, Lady, Queen.
/// Persistent: While Cersei is attacking in an Intrigue challenge, your active plot card
/// gains +1 claim.
/// Ported from: server/game/cards/01-Core/CerseiLannister.js
/// </summary>
[CardDefinition("01084")]
public sealed class CerseiLannister : CardScript
{
    protected override IEnumerable<CardAbilityDefinition> DeclareAbilities()
    {
        // Persistent: +1 claim on active plot during intrigue challenge while attacking
        // Handled by EffectEngine at challenge resolution time
        yield return AbilityBuilder.Persistent("cersei-claim-bonus")
            .Describe("While Cersei is attacking in an Intrigue challenge, your active plot gains +1 claim.")
            .Do(_ => Array.Empty<GameEvent>()) // EffectEngine handles this
            .Build();
    }
}
