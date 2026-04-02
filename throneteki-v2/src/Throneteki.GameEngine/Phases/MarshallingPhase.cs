using System.Collections.Immutable;
using Throneteki.Domain.Commands;
using Throneteki.Domain.Enums;
using Throneteki.Domain.Events;
using Throneteki.Domain.Interfaces;
using Throneteki.Domain.Models.GameAggregate;

namespace Throneteki.GameEngine.Phases;

/// <summary>
/// Marshalling Phase:
///   1. Enter: each player collects income from their active plot, then the first player
///      receives a prompt to marshal cards.
///   2. MarshalCard: a player plays a card from hand to the play area, spending gold.
///   3. Done: a player declares they are done marshalling; once both are done the phase
///      advances to Challenges.
/// </summary>
public sealed class MarshallingPhase
{
    private readonly ICardCatalog? _catalog;

    public MarshallingPhase(ICardCatalog? catalog = null) => _catalog = catalog;

    // ── Enter ─────────────────────────────────────────────────────────────────

    public IReadOnlyList<GameEvent> Enter(GameState state)
    {
        var events = new List<GameEvent>();
        int seq = state.Version + 1;

        events.Add(new PhaseStartedEvent(GamePhase.Marshalling) { SequenceNumber = seq++ });

        // Each player collects income from their active plot
        foreach (var player in state.Players)
        {
            int income = GetIncome(player);
            if (income > 0)
                events.Add(new GoldGainedEvent(player.PlayerId, income, "Plot income") { SequenceNumber = seq++ });
        }

        // Prompt the first player to marshal
        var firstPlayer = state.Players.FirstOrDefault(p => p.IsFirstPlayer) ?? state.Players[0];
        events.Add(MarshalPrompt(firstPlayer, seq++));

        return events;
    }

    // ── Marshal a card ────────────────────────────────────────────────────────

    public (bool IsValid, string? Error, IReadOnlyList<GameEvent> Events) MarshalCard(
        GameState state, MarshalCardCommand command)
    {
        var player = state.GetPlayer(command.PlayerId);
        var card = player.Hand.FirstOrDefault(c => c.InstanceId == command.CardInstanceId);

        if (card == null)
            return (false, "Card is not in hand.", Array.Empty<GameEvent>());

        int cost = GetCost(card);
        if (player.Gold < cost)
            return (false, $"Not enough gold. Cost: {cost}, Available: {player.Gold}.", Array.Empty<GameEvent>());

        var events = new List<GameEvent>();
        int seq = state.Version + 1;

        events.Add(new CardMarshalledEvent(player.PlayerId, card.InstanceId, cost) { SequenceNumber = seq++ });
        if (cost > 0)
            events.Add(new GoldSpentEvent(player.PlayerId, cost, "Marshal card") { SequenceNumber = seq++ });

        return (true, null, events);
    }

    // ── Done marshalling ──────────────────────────────────────────────────────

    public IReadOnlyList<GameEvent> Done(GameState state, ClaimMarshallingDoneCommand command)
    {
        var events = new List<GameEvent>();
        int seq = state.Version + 1;

        events.Add(new MarshallingDoneEvent(command.PlayerId) { SequenceNumber = seq++ });

        var otherPlayer = state.Players.FirstOrDefault(p => p.PlayerId != command.PlayerId);
        bool otherDone = otherPlayer?.PassedChallenges == true;

        if (otherDone)
        {
            // Both done — advance to Challenges
            events.Add(new PhaseStartedEvent(GamePhase.Challenges) { SequenceNumber = seq++ });
        }
        else
        {
            // Prompt the other player to marshal
            if (otherPlayer != null)
                events.Add(MarshalPrompt(otherPlayer, seq++));
        }

        return events;
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private int GetIncome(PlayerState player)
    {
        if (player.ActivePlot == null) return 0;
        var def = _catalog?.TryGet(player.ActivePlot.CardCode);
        return def?.Income ?? 0;
    }

    private int GetCost(CardInstance card)
    {
        var def = _catalog?.TryGet(card.CardCode);
        return def?.Cost ?? 0;
    }

    private static PromptIssuedEvent MarshalPrompt(PlayerState player, int seq) =>
        new PromptIssuedEvent(player.PlayerId, new PromptState
        {
            PromptId = Guid.NewGuid().ToString(),
            ActivePlayerId = player.PlayerId,
            Title = "Marshal cards",
            PromptType = PromptType.MenuChoice,
            Buttons = ImmutableList.Create(new PromptButton("done", "Done Marshalling")),
        })
        { SequenceNumber = seq };
}
