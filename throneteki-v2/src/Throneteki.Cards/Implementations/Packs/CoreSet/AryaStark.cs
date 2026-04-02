using Throneteki.Cards.Abilities;
using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;
using Throneteki.Domain.Models.GameAggregate;

namespace Throneteki.Cards.Implementations.Packs.CoreSet;

/// <summary>
/// Arya Stark (01141) — 2 cost, 2 STR, Intrigue icon.
/// Reaction: After Arya Stark is saved, kneel her.
/// Stealth keyword.
/// </summary>
[CardDefinition("01141")]
public sealed class AryaStark : CardScript
{
    protected override IEnumerable<CardAbilityDefinition> DeclareAbilities()
    {
        // Reaction: After a duplicate is sacrificed to save Arya → kneel her
        yield return AbilityBuilder.Reaction("arya-saved-kneel")
            .Describe("Reaction: After Arya Stark is saved, kneel her.")
            .OnEvent<DuplicateSacrificedEvent>((e, state) =>
            {
                // Check if the duplicate was on Arya (parent == Arya's instanceId)
                // We match by checking if there's a context source
                return true; // filtered by context at registration
            })
            .Do(ctx => new[]
            {
                new CardKneeledEvent(ctx.Source.InstanceId, "Arya saved") { }
            })
            .Build();
    }
}
