using Throneteki.Cards.Abilities;
using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;

namespace Throneteki.Cards.Implementations.Packs.CoreSet;

/// <summary>
/// Daenerys Targaryen (01160) — 7 cost, 5 STR, Military + Intrigue + Power icons.
/// Reaction: After Daenerys enters play, gain 3 gold.
/// </summary>
[CardDefinition("01160")]
public sealed class DaenerysTargaryen : CardScript
{
    protected override IEnumerable<CardAbilityDefinition> DeclareAbilities()
    {
        yield return AbilityBuilder.Reaction("daenerys-enter-play")
            .Describe("Reaction: After Daenerys enters play, gain 3 gold.")
            .OnEvent<CardMarshalledEvent>((e, _) => true) // further filtered by condition
            .When(ctx =>
            {
                var trigger = (CardMarshalledEvent)ctx.TriggeringEvent!;
                return trigger.CardInstanceId == ctx.Source.InstanceId;
            })
            .Do(ctx => new GameEvent[] { CommonEffects.GainGold(ctx, 3, "Daenerys Targaryen") })
            .Build();
    }
}
