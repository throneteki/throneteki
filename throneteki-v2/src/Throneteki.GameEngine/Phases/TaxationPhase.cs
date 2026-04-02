using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;
using Throneteki.Domain.Interfaces;
using Throneteki.Domain.Models.GameAggregate;

namespace Throneteki.GameEngine.Phases;

/// <summary>
/// Taxation Phase (rules step 7):
/// 7.1 Taxation phase begins.
/// 7.2 Return unspent gold to the treasury.
/// 7.3 Each player discards cards from hand down to their reserve value.
/// 7.5 Taxation phase ends. Round ends. Advance to next round's Plot phase.
/// (7.4 is Melee-only: return titles — skipped for Joust.)
/// </summary>
public sealed class TaxationPhase
{
    private readonly ICardCatalog? _catalog;

    public TaxationPhase(ICardCatalog? catalog = null) => _catalog = catalog;

    public IReadOnlyList<GameEvent> Execute(GameState state)
    {
        var events = new List<GameEvent>();
        int seq = state.Version + 1;

        events.Add(new PhaseStartedEvent(GamePhase.Taxation) { SequenceNumber = seq++ });

        foreach (var player in state.Players)
        {
            // 7.2 Return unspent gold to treasury
            if (player.Gold > 0)
                events.Add(new GoldSpentEvent(player.PlayerId, player.Gold, "Taxation")
                    { SequenceNumber = seq++ });

            // 7.3 Discard down to reserve value
            int reserve = GetReserveValue(player);
            int excessCards = player.Hand.Count - reserve;
            if (excessCards > 0)
            {
                // Simplified: discard from the end of hand (player choice in full game)
                for (int i = 0; i < excessCards; i++)
                {
                    var card = player.Hand[player.Hand.Count - 1 - i];
                    events.Add(new CardDiscardedEvent(card.InstanceId, player.PlayerId, CardLocation.Hand)
                        { SequenceNumber = seq++ });
                }
            }
        }

        // Advance to next round's Plot phase
        events.Add(new RoundStartedEvent(state.RoundNumber + 1) { SequenceNumber = seq++ });
        events.Add(new PhaseStartedEvent(GamePhase.Plot) { SequenceNumber = seq++ });

        return events;
    }

    private int GetReserveValue(PlayerState player)
    {
        if (player.ActivePlot == null) return int.MaxValue; // No plot = no limit
        var plotDef = _catalog?.TryGet(player.ActivePlot.CardCode);
        return plotDef?.Reserve ?? 6; // Default reserve of 6 if unknown
    }
}
