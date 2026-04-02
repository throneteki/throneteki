using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;
using Throneteki.Domain.Models.GameAggregate;

namespace Throneteki.GameEngine.Phases;

/// <summary>
/// Dominance Phase: the player with the most gold (kneeling contributions count in full game)
/// wins dominance and gains 1 power. Ties result in no winner.
/// Advances to the Standing phase.
/// </summary>
public sealed class DominancePhase
{
    public IReadOnlyList<GameEvent> Execute(GameState state)
    {
        var events = new List<GameEvent>();
        int seq = state.Version + 1;

        events.Add(new PhaseStartedEvent(GamePhase.Dominance) { SequenceNumber = seq++ });

        var p1 = state.Players[0];
        var p2 = state.Players[1];

        if (p1.Gold > p2.Gold)
        {
            events.Add(new DominanceWonEvent(p1.PlayerId) { SequenceNumber = seq++ });
            events.Add(new PowerGainedEvent(p1.PlayerId, PowerTargetType.Player, 1, "Dominance")
                { SequenceNumber = seq++ });
        }
        else if (p2.Gold > p1.Gold)
        {
            events.Add(new DominanceWonEvent(p2.PlayerId) { SequenceNumber = seq++ });
            events.Add(new PowerGainedEvent(p2.PlayerId, PowerTargetType.Player, 1, "Dominance")
                { SequenceNumber = seq++ });
        }
        else
        {
            events.Add(new DominanceTiedEvent { SequenceNumber = seq++ });
        }

        events.Add(new PhaseStartedEvent(GamePhase.Standing) { SequenceNumber = seq++ });

        return events;
    }
}
