using System.Collections.Immutable;
using Throneteki.Domain.Enums;

namespace Throneteki.Domain.Models.GameAggregate;

public sealed record AllowedChallenges
{
    public int MilitaryRemaining { get; init; } = 1;
    public int IntrigueRemaining { get; init; } = 1;
    public int PowerRemaining { get; init; } = 1;
    public ImmutableList<ChallengeIcon> Won { get; init; } = ImmutableList<ChallengeIcon>.Empty;
    public ImmutableList<ChallengeIcon> Lost { get; init; } = ImmutableList<ChallengeIcon>.Empty;

    public bool CanInitiate(ChallengeIcon type) => type switch
    {
        ChallengeIcon.Military => MilitaryRemaining > 0,
        ChallengeIcon.Intrigue => IntrigueRemaining > 0,
        ChallengeIcon.Power => PowerRemaining > 0,
        _ => false
    };

    public AllowedChallenges UseChallenge(ChallengeIcon type) => type switch
    {
        ChallengeIcon.Military => this with { MilitaryRemaining = MilitaryRemaining - 1 },
        ChallengeIcon.Intrigue => this with { IntrigueRemaining = IntrigueRemaining - 1 },
        ChallengeIcon.Power => this with { PowerRemaining = PowerRemaining - 1 },
        _ => this
    };

    public AllowedChallenges RecordWin(ChallengeIcon type) => this with { Won = Won.Add(type) };
    public AllowedChallenges RecordLoss(ChallengeIcon type) => this with { Lost = Lost.Add(type) };
    public bool HasWon(ChallengeIcon type) => Won.Contains(type);
    public bool HasLost(ChallengeIcon type) => Lost.Contains(type);

    public static readonly AllowedChallenges Default = new();
}

public sealed record PlayerState
{
    public required Guid PlayerId { get; init; }
    public required string Username { get; init; }

    public int Gold { get; init; }
    public int FactionPower { get; init; }

    // Card piles -- ordered lists where order matters (deck top = index 0)
    public ImmutableList<CardInstance> Hand { get; init; } = ImmutableList<CardInstance>.Empty;
    public ImmutableList<CardInstance> DrawDeck { get; init; } = ImmutableList<CardInstance>.Empty;
    public ImmutableList<CardInstance> DiscardPile { get; init; } = ImmutableList<CardInstance>.Empty;
    public ImmutableList<CardInstance> DeadPile { get; init; } = ImmutableList<CardInstance>.Empty;
    public ImmutableList<CardInstance> CardsInPlay { get; init; } = ImmutableList<CardInstance>.Empty;
    public ImmutableList<CardInstance> PlotDeck { get; init; } = ImmutableList<CardInstance>.Empty;
    public ImmutableList<CardInstance> PlotDiscard { get; init; } = ImmutableList<CardInstance>.Empty;
    public ImmutableList<CardInstance> Shadows { get; init; } = ImmutableList<CardInstance>.Empty;
    public ImmutableList<CardInstance> OutOfGame { get; init; } = ImmutableList<CardInstance>.Empty;

    public CardInstance? ActivePlot { get; init; }
    public CardInstance? SelectedPlot { get; init; }  // During plot selection phase
    public required CardInstance Faction { get; init; }
    public CardInstance? Agenda { get; init; }

    public AllowedChallenges Challenges { get; init; } = AllowedChallenges.Default;
    public bool IsFirstPlayer { get; init; }
    public bool PassedChallenges { get; init; }  // Player has chosen to end their challenges

    /// <summary>Find a card instance by ID across all piles.</summary>
    public CardInstance? FindCard(Guid instanceId)
    {
        foreach (var pile in AllPiles())
            foreach (var card in pile)
            {
                if (card.InstanceId == instanceId) return card;
                foreach (var attachId in card.Attachments)
                    if (attachId == instanceId)
                    {
                        var attached = pile.FirstOrDefault(c => c.InstanceId == attachId);
                        if (attached != null) return attached;
                    }
            }
        if (ActivePlot?.InstanceId == instanceId) return ActivePlot;
        if (SelectedPlot?.InstanceId == instanceId) return SelectedPlot;
        if (Faction.InstanceId == instanceId) return Faction;
        if (Agenda?.InstanceId == instanceId) return Agenda;
        return null;
    }

    public IEnumerable<ImmutableList<CardInstance>> AllPiles() =>
        new[] { Hand, DrawDeck, DiscardPile, DeadPile, CardsInPlay, PlotDeck, PlotDiscard, Shadows, OutOfGame };

    public IEnumerable<CardInstance> AllCards()
    {
        foreach (var pile in AllPiles())
            foreach (var card in pile)
                yield return card;
        if (ActivePlot != null) yield return ActivePlot;
        if (SelectedPlot != null) yield return SelectedPlot;
        yield return Faction;
        if (Agenda != null) yield return Agenda;
    }

    public PlayerState UpdateCard(Guid instanceId, Func<CardInstance, CardInstance> update)
    {
        return this with
        {
            Hand = UpdateInList(Hand, instanceId, update),
            DrawDeck = UpdateInList(DrawDeck, instanceId, update),
            DiscardPile = UpdateInList(DiscardPile, instanceId, update),
            DeadPile = UpdateInList(DeadPile, instanceId, update),
            CardsInPlay = UpdateInList(CardsInPlay, instanceId, update),
            PlotDeck = UpdateInList(PlotDeck, instanceId, update),
            PlotDiscard = UpdateInList(PlotDiscard, instanceId, update),
            Shadows = UpdateInList(Shadows, instanceId, update),
            OutOfGame = UpdateInList(OutOfGame, instanceId, update),
            ActivePlot = ActivePlot?.InstanceId == instanceId ? update(ActivePlot) : ActivePlot,
            SelectedPlot = SelectedPlot?.InstanceId == instanceId ? update(SelectedPlot) : SelectedPlot,
            Faction = Faction.InstanceId == instanceId ? update(Faction) : Faction,
            Agenda = Agenda?.InstanceId == instanceId ? update(Agenda) : Agenda,
        };
    }

    private static ImmutableList<CardInstance> UpdateInList(
        ImmutableList<CardInstance> list, Guid id, Func<CardInstance, CardInstance> update)
    {
        var idx = list.FindIndex(c => c.InstanceId == id);
        return idx >= 0 ? list.SetItem(idx, update(list[idx])) : list;
    }

    public int TotalPower => FactionPower + CardsInPlay.Sum(c => c.Power);
}
