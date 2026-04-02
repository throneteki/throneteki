using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;
using Throneteki.Domain.Models.GameAggregate;

namespace Throneteki.GameEngine.Phases;

/// <summary>
/// Taxation Phase: all gold is removed from players. Advances to the Plot phase (next round).
/// </summary>
public sealed class TaxationPhase
{
    public IReadOnlyList<GameEvent> Execute(GameState state)
    {
        var events = new List<GameEvent>();
        int seq = state.Version + 1;

        events.Add(new PhaseStartedEvent(GamePhase.Taxation) { SequenceNumber = seq++ });

        foreach (var player in state.Players)
        {
            if (player.Gold > 0)
                events.Add(new GoldSpentEvent(player.PlayerId, player.Gold, "Taxation")
                    { SequenceNumber = seq++ });
        }

        // Advance to next round's Plot phase
        events.Add(new PhaseStartedEvent(GamePhase.Plot) { SequenceNumber = seq++ });

        return events;
    }
}
