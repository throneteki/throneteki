using Throneteki.Cards.Abilities;
using Throneteki.Domain.Events;

namespace Throneteki.Cards.Implementations.Packs.CoreSet;

/// <summary>
/// The Iron Throne (01163) — Baratheon location, 2 cost.
/// Action: Kneel The Iron Throne to gain 2 gold.
/// </summary>
[CardDefinition("01163")]
public sealed class IronThrone : CardScript
{
    protected override IEnumerable<CardAbilityDefinition> DeclareAbilities()
    {
        yield return AbilityBuilder.Action("iron-throne-gold")
            .Describe("Action: Kneel The Iron Throne to gain 2 gold.")
            .When(CommonEffects.SourceIsStanding)
            .Do(ctx => CommonEffects.KneelSelfThen(ctx,
                CommonEffects.GainGold(ctx, 2, "The Iron Throne")))
            .Build();
    }
}
