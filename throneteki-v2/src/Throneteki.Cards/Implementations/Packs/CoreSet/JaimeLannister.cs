using Throneteki.Cards.Abilities;
using Throneteki.Domain.Events;

namespace Throneteki.Cards.Implementations.Packs.CoreSet;

/// <summary>
/// Ser Jaime Lannister (01087) — 6 cost, 5 STR, Military + Intrigue icons.
/// Lannister, Knight, Lord.
/// Persistent: Jaime does not kneel when declared as a Military attacker.
/// Persistent: While participating in a Military challenge, Jaime gains Renown.
/// Ported from: server/game/cards/01-Core/SerJaimeLannister.js
/// </summary>
[CardDefinition("01087")]
public sealed class JaimeLannister : CardScript
{
    protected override IEnumerable<CardAbilityDefinition> DeclareAbilities()
    {
        // Persistent: does not kneel as military attacker
        yield return AbilityBuilder.Persistent("jaime-no-kneel-mil")
            .Describe("Jaime does not kneel when declared as a Military challenge attacker.")
            .Do(_ => Array.Empty<GameEvent>()) // EffectEngine handles this
            .Build();

        // Persistent: gains Renown while participating in military challenges
        yield return AbilityBuilder.Persistent("jaime-renown-mil")
            .Describe("While participating in a Military challenge, Jaime gains Renown.")
            .Do(_ => Array.Empty<GameEvent>()) // EffectEngine handles this
            .Build();
    }
}
