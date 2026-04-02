using Throneteki.Cards.Abilities;
using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;
using Throneteki.Domain.Models.GameAggregate;

namespace Throneteki.Cards.Implementations.Packs.CoreSet;

/// <summary>
/// Tears of Lys (01044) — 1 cost event.
/// Reaction: After you win an Intrigue challenge as the attacking player,
/// choose a character without an Intrigue icon the losing player controls.
/// At the end of the phase, kill that character (poison).
/// Max 1 per challenge.
/// Ported from: server/game/cards/01-Core/TearsOfLys.js
/// </summary>
[CardDefinition("01044")]
public sealed class TearsOfLys : CardScript
{
    protected override IEnumerable<CardAbilityDefinition> DeclareAbilities()
    {
        yield return AbilityBuilder.Reaction("tears-of-lys-kill")
            .Describe("Reaction: After winning Intrigue as attacker, choose a character without Intrigue icon. Kill at end of phase.")
            .Costs(1)
            .LimitPerRound(1) // max 1 per challenge (approximated as per round)
            .OnEvent<ChallengeResultDeterminedEvent>((e, state) =>
                state.ActiveChallenge?.Type == ChallengeIcon.Intrigue &&
                e.WinnerId != null)
            .When(ctx => CommonEffects.ControllerIsAttacker(ctx))
            .TargetCard((state, source, target) =>
            {
                var challenge = state.ActiveChallenge;
                return challenge != null &&
                       target.Location == CardLocation.PlayArea &&
                       target.ControllerId == challenge.DefendingPlayerId;
                // Note: full implementation should also check target has no Intrigue icon
                // via ICardCatalog lookup (target card's printed icons)
            })
            .Do(ctx => new GameEvent[]
            {
                CommonEffects.AddToken(ctx.Target!.InstanceId, "poison", 1),
                CommonEffects.Log($"Tears of Lys poisons {ctx.Target.CardCode} — will die at end of phase."),
            })
            .Build();
    }
}
