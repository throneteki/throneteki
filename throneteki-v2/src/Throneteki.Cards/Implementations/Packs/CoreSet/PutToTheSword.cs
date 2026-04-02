using Throneteki.Cards.Abilities;
using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;
using Throneteki.Domain.Models.GameAggregate;

namespace Throneteki.Cards.Implementations.Packs.CoreSet;

/// <summary>
/// Put to the Sword (01041) — 2 cost event.
/// Reaction: After you win a Military challenge by 5 or more STR as the attacking
///           player, choose a character the losing player controls. Kill that character.
///           (Max 1 per challenge.)
/// Ported from: server/game/cards/01-Core/PutToTheSword.js
///
/// JS: afterChallenge, military, winner===controller, attacker===controller,
///     strengthDifference >= 5. Max perChallenge(1). Target: play area, loser's control,
///     character type, gameAction: 'kill'.
///
/// Known gaps:
/// - Limit should be perChallenge(1) (max), not perRound(1)
/// - Target needs character type filter via ICardCatalog
/// - Target needs gameAction 'kill' immunity check
/// - Winner check should verify controller IS the winner explicitly
/// </summary>
[CardDefinition("01041")]
public sealed class PutToTheSword : CardScript
{
    protected override IEnumerable<CardAbilityDefinition> DeclareAbilities()
    {
        yield return AbilityBuilder.Reaction("put-to-the-sword-kill")
            .Describe("Reaction: After winning Military by 5+ STR as attacker, kill a character. (Max 1/challenge.)")
            .Costs(2)
            .LimitPerRound(1) // TODO: Should be max perChallenge(1)
            .OnEvent<ChallengeResultDeterminedEvent>((e, state) =>
                state.ActiveChallenge?.Type == ChallengeIcon.Military &&
                e.WinnerId != null &&
                e.WinnerStrength - e.LoserStrength >= 5)
            .When(ctx =>
            {
                var result = (ChallengeResultDeterminedEvent)ctx.TriggeringEvent!;
                return result.WinnerId == ctx.ControllingPlayerId &&
                       CommonEffects.ControllerIsAttacker(ctx);
            })
            .TargetCard((state, source, target) =>
            {
                var challenge = state.ActiveChallenge;
                return challenge != null &&
                       target.Location == CardLocation.PlayArea &&
                       target.ControllerId == challenge.DefendingPlayerId;
                // TODO: Filter to character type via ICardCatalog
                // TODO: Check gameAction 'kill' (not immune to kill)
            })
            .Do(ctx => new GameEvent[]
            {
                CommonEffects.Kill(ctx.Target!.InstanceId, ctx.Target.OwnerId),
            })
            .Build();
    }
}
