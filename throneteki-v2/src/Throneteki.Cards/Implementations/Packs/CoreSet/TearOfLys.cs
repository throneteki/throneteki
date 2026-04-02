using Throneteki.Cards.Abilities;
using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;
using Throneteki.Domain.Models.GameAggregate;

namespace Throneteki.Cards.Implementations.Packs.CoreSet;

/// <summary>
/// Tears of Lys (01044) — 1 cost event.
/// Reaction: After you win an Intrigue challenge as the attacking player,
///           choose a character without an Intrigue icon the losing player controls.
///           At the end of the phase, kill that character (poison).
///           (Max 1 per challenge.)
/// Ported from: server/game/cards/01-Core/TearsOfLys.js
///
/// JS: afterChallenge, attacker===controller, winner===controller, intrigue.
///     Max perChallenge(1). Target: play area, loser's control, character type,
///     !hasIcon('intrigue'). Effect: atEndOfPhase with poison (delayed kill).
///
/// Known gaps:
/// - Limit should be perChallenge(1) (max), not perRound(1)
/// - Target needs character type filter via ICardCatalog
/// - Target needs !hasIcon('intrigue') check via ICardCatalog
/// - Effect should be delayed kill at end of phase (atEndOfPhase), not immediate token
/// - Winner check should verify controller IS the winner explicitly
/// </summary>
[CardDefinition("01044")]
public sealed class TearsOfLys : CardScript
{
    protected override IEnumerable<CardAbilityDefinition> DeclareAbilities()
    {
        yield return AbilityBuilder.Reaction("tears-of-lys-kill")
            .Describe("Reaction: After winning Intrigue as attacker, poison a character without Intrigue icon. (Max 1/challenge.)")
            .Costs(1)
            .LimitPerRound(1) // TODO: Should be max perChallenge(1)
            .OnEvent<ChallengeResultDeterminedEvent>((e, state) =>
                state.ActiveChallenge?.Type == ChallengeIcon.Intrigue &&
                e.WinnerId != null)
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
                // TODO: Check !hasIcon('intrigue') via ICardCatalog
            })
            .Do(ctx => new GameEvent[]
            {
                // TODO: Should be atEndOfPhase delayed kill, not immediate token
                CommonEffects.AddToken(ctx.Target!.InstanceId, "poison", 1),
                CommonEffects.Log($"Tears of Lys poisons {ctx.Target.CardCode} — will die at end of phase."),
            })
            .Build();
    }
}
