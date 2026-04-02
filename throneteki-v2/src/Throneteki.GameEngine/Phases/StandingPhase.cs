using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;
using Throneteki.Domain.Models.GameAggregate;

namespace Throneteki.GameEngine.Phases;

/// <summary>
/// Standing Phase: all kneeled cards stand. Advances to the Taxation phase.
/// </summary>
public sealed class StandingPhase
{
    public IReadOnlyList<GameEvent> Execute(GameState state)
    {
        var events = new List<GameEvent>();
        int seq = state.Version + 1;

        events.Add(new PhaseStartedEvent(GamePhase.Standing) { SequenceNumber = seq++ });

        foreach (var player in state.Players)
        {
            foreach (var card in player.CardsInPlay.Where(c => c.Kneeled))
                events.Add(new CardStoodEvent(card.InstanceId) { SequenceNumber = seq++ });

            // Also stand the faction card if kneeled
            if (player.Faction.Kneeled)
                events.Add(new CardStoodEvent(player.Faction.InstanceId) { SequenceNumber = seq++ });
        }

        events.Add(new PhaseStartedEvent(GamePhase.Taxation) { SequenceNumber = seq++ });

        return events;
    }
}
