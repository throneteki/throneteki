using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;
using Throneteki.Domain.Models.GameAggregate;

namespace Throneteki.GameEngine.Phases;

/// <summary>
/// Draw Phase: Each player draws 2 cards from their deck (or fewer if the deck is small).
/// This phase is fully automated -- no player input required.
/// </summary>
public sealed class DrawPhase
{
    private const int DrawCount = 2;

    public IReadOnlyList<GameEvent> Execute(GameState state)
    {
        var events = new List<GameEvent>();
        int seq = state.Version + 1;

        events.Add(new PhaseStartedEvent(GamePhase.Draw) { SequenceNumber = seq++ });

        foreach (var player in state.Players)
        {
            var toDraw = Math.Min(DrawCount, player.DrawDeck.Count);
            for (int i = 0; i < toDraw; i++)
            {
                var card = player.DrawDeck[i];
                events.Add(new CardDrawnEvent(player.PlayerId, card.InstanceId) { SequenceNumber = seq++ });
            }
        }

        events.Add(new PhaseStartedEvent(GamePhase.Marshalling) { SequenceNumber = seq++ });

        return events;
    }
}
