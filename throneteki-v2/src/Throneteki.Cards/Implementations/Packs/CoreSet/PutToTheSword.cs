using Throneteki.Cards.Abilities;
using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;
using Throneteki.Domain.Models.GameAggregate;

namespace Throneteki.Cards.Implementations.Packs.CoreSet;

/// <summary>
/// Put to the Sword (01041) — 1 cost event.
/// Reaction: After you win a Military challenge by 5 or more STR,
/// choose a character the losing player controls. Kill that character.
/// </summary>
[CardDefinition("01041")]
public sealed class PutToTheSword : CardScript
{
    protected override IEnumerable<CardAbilityDefinition> DeclareAbilities()
    {
        yield return AbilityBuilder.Reaction("put-to-the-sword-kill")
            .Describe("Reaction: After winning Military by 5+ STR, kill a character the loser controls.")
            .Costs(1)
            .OnEvent<ChallengeResultDeterminedEvent>((e, state) =>
                state.ActiveChallenge?.Type == ChallengeIcon.Military &&
                e.WinnerId != null &&
                e.WinnerStrength - e.LoserStrength >= 5)
            .When(ctx => CommonEffects.ControllerIsAttacker(ctx))
            .TargetCard((state, source, target) =>
            {
                var challenge = state.ActiveChallenge;
                return challenge != null &&
                       target.Location == CardLocation.PlayArea &&
                       target.ControllerId == challenge.DefendingPlayerId;
            })
            .Do(ctx => new GameEvent[]
            {
                CommonEffects.Kill(ctx.Target!.InstanceId, ctx.Target.OwnerId),
            })
            .Build();
    }
}
