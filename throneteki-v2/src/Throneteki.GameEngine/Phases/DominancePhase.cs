using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;
using Throneteki.Domain.Interfaces;
using Throneteki.Domain.Models.GameAggregate;

namespace Throneteki.GameEngine.Phases;

/// <summary>
/// Dominance Phase (rules step 5):
/// 5.1 Dominance phase begins.
/// 5.2 Count standing STR + unspent gold for each player.
///     The player with the higher total wins and gains 1 power on their faction.
///     Ties: no winner.
/// 5.3 Dominance phase ends. Advance to Standing phase.
/// </summary>
public sealed class DominancePhase
{
    private readonly ICardCatalog? _catalog;

    public DominancePhase(ICardCatalog? catalog = null) => _catalog = catalog;

    public IReadOnlyList<GameEvent> Execute(GameState state)
    {
        var events = new List<GameEvent>();
        int seq = state.Version + 1;

        events.Add(new PhaseStartedEvent(GamePhase.Dominance) { SequenceNumber = seq++ });

        var p1 = state.Players[0];
        var p2 = state.Players[1];

        int p1Strength = CalculateDominanceStrength(p1);
        int p2Strength = CalculateDominanceStrength(p2);

        if (p1Strength > p2Strength)
        {
            events.Add(new DominanceWonEvent(p1.PlayerId) { SequenceNumber = seq++ });
            events.Add(new PowerGainedEvent(p1.PlayerId, PowerTargetType.Player, 1, "Dominance")
                { SequenceNumber = seq++ });
        }
        else if (p2Strength > p1Strength)
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

    /// <summary>
    /// Dominance strength = unspent gold + STR of each standing character.
    /// Some cards (e.g. The Iron Throne) add additional dominance STR via effects.
    /// </summary>
    private int CalculateDominanceStrength(PlayerState player)
    {
        int total = player.Gold;

        foreach (var card in player.CardsInPlay.Where(c => !c.Kneeled))
        {
            var def = _catalog?.TryGet(card.CardCode);
            if (def != null && def.Type == CardType.Character)
                total += (def.PrintedStrength ?? 0) + card.StrengthModifier;
        }

        return total;
    }
}
