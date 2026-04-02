using Throneteki.Cards.Abilities;
using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;

namespace Throneteki.Cards.Implementations.Packs.CoreSet;

/// <summary>
/// Jaime Lannister (01087) — 6 cost, 5 STR, Military + Intrigue icons.
/// Renown keyword.
/// Action: During a Military challenge, kneel Jaime to stand another Lannister character.
/// </summary>
[CardDefinition("01087")]
public sealed class JaimeLannister : CardScript
{
    protected override IEnumerable<CardAbilityDefinition> DeclareAbilities()
    {
        yield return AbilityBuilder.Action("jaime-stand")
            .Describe("Action: During a Military challenge, kneel Jaime to stand another Lannister character.")
            .DuringPhase(GamePhase.Challenges)
            .When(CommonEffects.SourceIsStanding)
            .When(ctx => ctx.State.ActiveChallenge?.Type == ChallengeIcon.Military)
            .TargetCard((state, source, target) =>
                target.Location == Domain.Enums.CardLocation.PlayArea &&
                target.InstanceId != source.InstanceId &&
                target.Kneeled)
            .Do(ctx => CommonEffects.KneelSelfThen(ctx,
                CommonEffects.Stand(ctx.Target!.InstanceId)))
            .Build();
    }
}
