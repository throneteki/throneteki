using Throneteki.Cards.Abilities;
using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;
using Throneteki.Domain.Models.GameAggregate;

namespace Throneteki.Cards.Implementations.Packs.CoreSet;

/// <summary>
/// The Rains of Castamere (agenda) — Lannister agenda.
/// When you win an Intrigue challenge by 5 or more STR, you may search your plot deck for
/// a plot card with "The Rains of Castamere" in the game text and immediately reveal it.
/// </summary>
[CardDefinition("agenda-castamere")]
public sealed class TheRainsOfCastamere : CardScript
{
    protected override IEnumerable<CardAbilityDefinition> DeclareAbilities()
    {
        yield return AbilityBuilder.Reaction("castamere-search")
            .Describe("Reaction: After you win Intrigue by 5+ STR, reveal a scheme plot.")
            .OnEvent<ChallengeResultDeterminedEvent>((e, state) =>
            {
                var challenge = state.ActiveChallenge;
                return challenge != null &&
                       challenge.Type == ChallengeIcon.Intrigue &&
                       e.WinnerId != null &&
                       e.WinnerStrength - e.LoserStrength >= 5;
            })
            .Do(ctx =>
            {
                // The full implementation would open a search prompt.
                // Emit a placeholder prompt for now.
                return new GameEvent[]
                {
                    new GameMessageEvent("The Rains of Castamere: search for a scheme plot.") { }
                };
            })
            .Build();
    }
}
