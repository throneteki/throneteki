using Throneteki.Cards.Abilities;
using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;

namespace Throneteki.Cards.Implementations.Packs.CoreSet;

/// <summary>
/// Tyrion Lannister (01089) — 5 cost, 4 STR, Intrigue + Power icons. Lannister, Lord.
/// Reaction: After an Intrigue challenge is initiated, gain 2 gold. (Limit 2 per round.)
/// Ported from: server/game/cards/01-Core/TyrionLannister.js
/// </summary>
[CardDefinition("01089")]
public sealed class TyrionLannister : CardScript
{
    protected override IEnumerable<CardAbilityDefinition> DeclareAbilities()
    {
        yield return AbilityBuilder.Reaction("tyrion-gold")
            .Describe("Reaction: After an Intrigue challenge is initiated, gain 2 gold. (Limit 2 per round.)")
            .OnEvent<ChallengeInitiatedEvent>((e, _) =>
                e.ChallengeType == ChallengeIcon.Intrigue)
            .LimitPerRound(2)
            .Do(ctx => new GameEvent[]
            {
                CommonEffects.GainGold(ctx, 2, "Tyrion Lannister"),
            })
            .Build();
    }
}
