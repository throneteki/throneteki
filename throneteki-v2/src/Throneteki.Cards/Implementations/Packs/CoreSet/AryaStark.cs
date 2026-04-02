using Throneteki.Cards.Abilities;
using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;

namespace Throneteki.Cards.Implementations.Packs.CoreSet;

/// <summary>
/// Arya Stark (01141) — 3 cost, 2 STR, Power icon. Stark, Lady.
/// Persistent: While Arya has a duplicate, she gains a Military icon.
/// Reaction: After Arya enters play, place the top card of your deck on her as a duplicate.
/// Ported from: server/game/cards/01-Core/AryaStark.js
/// </summary>
[CardDefinition("01141")]
public sealed class AryaStark : CardScript
{
    protected override IEnumerable<CardAbilityDefinition> DeclareAbilities()
    {
        // Persistent: gains Military icon when she has a duplicate
        // (Handled by EffectEngine: AddIconEffect registered when dupe count >= 1)
        yield return AbilityBuilder.Persistent("arya-military-icon")
            .Describe("While Arya has a duplicate, she gains a Military icon.")
            .Do(_ => Array.Empty<GameEvent>()) // Effect engine handles this
            .Build();

        // Reaction: After Arya enters play, place top card of deck as a duplicate
        yield return AbilityBuilder.Reaction("arya-auto-dupe")
            .Describe("Reaction: After Arya enters play, place the top card of your deck on her as a duplicate.")
            .OnEvent<CardMarshalledEvent>((e, _) => true)
            .When(ctx =>
            {
                var trigger = (CardMarshalledEvent)ctx.TriggeringEvent!;
                return trigger.CardInstanceId == ctx.Source.InstanceId;
            })
            .Do(ctx =>
            {
                var player = ctx.State.GetPlayer(ctx.ControllingPlayerId);
                if (player.DrawDeck.Count == 0) return Array.Empty<GameEvent>();

                var topCard = player.DrawDeck[0];
                return new GameEvent[]
                {
                    new DuplicatePlacedEvent(topCard.InstanceId, ctx.Source.InstanceId),
                    CommonEffects.Log($"{player.Username} places the top card of their deck on Arya Stark as a duplicate"),
                };
            })
            .Build();
    }
}
