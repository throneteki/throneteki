using Throneteki.Cards.Abilities;
using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;
using Throneteki.Domain.Models.GameAggregate;

namespace Throneteki.Cards.Implementations.Packs.CoreSet;

/// <summary>
/// Put to the Sword (01041) — 1 cost event.
/// Reaction: After you win a Military challenge by 5 or more STR as the attacking
/// player, choose a character the losing player controls. Kill that character.
/// Max 1 per challenge.
/// Ported from: server/game/cards/01-Core/PutToTheSword.js
/// </summary>
[CardDefinition("01041")]
public sealed class PutToTheSword : CardScript
{
    protected override IEnumerable<CardAbilityDefinition> DeclareAbilities()
    {
        yield return AbilityBuilder.Reaction("put-to-the-sword-kill")
            .Describe("Reaction: After winning Military by 5+ STR as attacker, kill a character the loser controls. Max 1 per challenge.")
            .Costs(1)
            .LimitPerRound(1) // max 1 per challenge (approximated as per round)
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
                // Note: should also filter target.CardType == Character via catalog
            })
            .Do(ctx => new GameEvent[]
            {
                CommonEffects.Kill(ctx.Target!.InstanceId, ctx.Target.OwnerId),
            })
            .Build();
    }
}
