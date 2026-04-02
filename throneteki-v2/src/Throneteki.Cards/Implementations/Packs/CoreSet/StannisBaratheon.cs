using Throneteki.Cards.Abilities;
using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;
using Throneteki.Domain.Models.GameAggregate;

namespace Throneteki.Cards.Implementations.Packs.CoreSet;

/// <summary>
/// Stannis Baratheon (01052) — 5 cost, 4 STR, Military + Power icons.
/// Reaction: After you marshal a character with the R'hllor trait, stand Stannis.
/// </summary>
[CardDefinition("01052")]
public sealed class StannisBaratheon : CardScript
{
    protected override IEnumerable<CardAbilityDefinition> DeclareAbilities()
    {
        yield return AbilityBuilder.Reaction("stannis-stand")
            .Describe("Reaction: After you marshal a R'hllor character, stand Stannis.")
            .OnEvent<CardMarshalledEvent>((e, _) => true) // filtered further by condition
            .When(ctx =>
            {
                var trigger = (CardMarshalledEvent)ctx.TriggeringEvent!;
                return trigger.PlayerId == ctx.ControllingPlayerId &&
                       trigger.CardInstanceId != ctx.Source.InstanceId &&
                       ctx.Source.Kneeled;
            })
            .Do(ctx => new GameEvent[] { CommonEffects.Stand(ctx.Source.InstanceId) })
            .Build();
    }
}
