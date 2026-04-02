using Throneteki.Cards.Abilities;
using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;

namespace Throneteki.Cards.Implementations.Packs.CoreSet;

/// <summary>
/// A Clash of Kings (01001) — Plot. Income 4, Initiative 9, Claim 1, Reserve 6.
/// Reaction: After you win a Power challenge, move 1 power from the losing player's
/// faction card to your own.
/// Ported from: server/game/cards/01-Core/AClashOfKings.js
/// </summary>
[CardDefinition("01001")]
public sealed class AClashOfKings : CardScript
{
    protected override IEnumerable<CardAbilityDefinition> DeclareAbilities()
    {
        yield return AbilityBuilder.Reaction("clash-move-power")
            .Describe("Reaction: After you win a Power challenge, move 1 power from the loser's faction to yours.")
            .OnEvent<ChallengeResultDeterminedEvent>((e, state) =>
                state.ActiveChallenge?.Type == ChallengeIcon.Power && e.WinnerId != null)
            .When(ctx => CommonEffects.ControllerIsAttacker(ctx))
            .Do(ctx =>
            {
                var challenge = ctx.State.ActiveChallenge!;
                var loser = ctx.State.GetPlayer(challenge.DefendingPlayerId);
                if (loser.FactionPower <= 0) return Array.Empty<GameEvent>();

                return new GameEvent[]
                {
                    new PowerLostEvent(loser.PlayerId, PowerTargetType.Player, 1),
                    CommonEffects.GainFactionPower(ctx, 1, "A Clash of Kings"),
                };
            })
            .Build();
    }
}
