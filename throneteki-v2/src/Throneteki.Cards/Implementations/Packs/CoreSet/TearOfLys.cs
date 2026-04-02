using Throneteki.Cards.Abilities;
using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;
using Throneteki.Domain.Models.GameAggregate;

namespace Throneteki.Cards.Implementations.Packs.CoreSet;

/// <summary>
/// Tears of Lys (01044) — 1 cost event.
/// Reaction: After you win an Intrigue challenge, choose a character without attachments
/// the losing player controls. At the end of the phase, kill that character.
/// </summary>
[CardDefinition("01044")]
public sealed class TearsOfLys : CardScript
{
    protected override IEnumerable<CardAbilityDefinition> DeclareAbilities()
    {
        yield return AbilityBuilder.Reaction("tears-of-lys-kill")
            .Describe("Reaction: After winning Intrigue, choose a character to kill at end of phase.")
            .Costs(1)
            .OnEvent<ChallengeResultDeterminedEvent>((e, state) =>
                state.ActiveChallenge?.Type == ChallengeIcon.Intrigue && e.WinnerId != null)
            .When(ctx => CommonEffects.ControllerIsAttacker(ctx))
            .TargetCard((state, source, target) =>
            {
                var challenge = state.ActiveChallenge;
                return challenge != null &&
                       target.Location == CardLocation.PlayArea &&
                       target.ControllerId == challenge.DefendingPlayerId &&
                       target.Attachments.Count == 0;
            })
            .Do(ctx => new GameEvent[]
            {
                CommonEffects.AddToken(ctx.Target!.InstanceId, "poison", 1),
                CommonEffects.Log($"Tears of Lys targets {ctx.Target.CardCode} — will die at end of phase."),
            })
            .Build();
    }
}
