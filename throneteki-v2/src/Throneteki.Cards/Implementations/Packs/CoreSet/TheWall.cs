using Throneteki.Cards.Abilities;
using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;

namespace Throneteki.Cards.Implementations.Packs.CoreSet;

/// <summary>
/// The Wall (01137) — 4 cost, Night's Watch location.
/// Action: Kneel The Wall to gain 2 gold.
/// Reaction: After you win a challenge as the defending player, kneel The Wall
/// to stand each defending character.
/// </summary>
[CardDefinition("01137")]
public sealed class TheWall : CardScript
{
    protected override IEnumerable<CardAbilityDefinition> DeclareAbilities()
    {
        yield return AbilityBuilder.Reaction("wall-stand-defenders")
            .Describe("Reaction: After you win a challenge defending, kneel The Wall to stand each defender.")
            .OnEvent<ChallengeResultDeterminedEvent>((e, _) => e.WinnerId != null)
            .When(CommonEffects.SourceIsStanding)
            .When(ctx => CommonEffects.ControllerIsDefender(ctx) &&
                         CommonEffects.ControllerWonChallenge(ctx,
                             (ChallengeResultDeterminedEvent)ctx.TriggeringEvent!))
            .Do(ctx =>
            {
                var challenge = ctx.State.ActiveChallenge!;
                var events = new List<GameEvent> { CommonEffects.Kneel(ctx.Source.InstanceId, "The Wall") };
                foreach (var defenderId in challenge.Defenders)
                    events.Add(CommonEffects.Stand(defenderId));
                return events;
            })
            .Build();
    }
}
