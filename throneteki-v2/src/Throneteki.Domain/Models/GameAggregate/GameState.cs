using System.Collections.Immutable;
using Throneteki.Domain.Enums;

namespace Throneteki.Domain.Models.GameAggregate;

/// <summary>
/// The complete, immutable game state. Rebuilt from events via GameStateProjector.
/// This is the aggregate root.
/// </summary>
public sealed record GameState
{
    public required Guid GameId { get; init; }

    /// <summary>Event sequence number. Used for optimistic concurrency.</summary>
    public int Version { get; init; }

    public required GamePhase Phase { get; init; }
    public int RoundNumber { get; init; }
    public required GameStatus Status { get; init; }
    public required GameFormat Format { get; init; }

    public ImmutableList<PlayerState> Players { get; init; } = ImmutableList<PlayerState>.Empty;

    /// <summary>Ordered list of player IDs for turn order.</summary>
    public ImmutableList<Guid> PlayerOrder { get; init; } = ImmutableList<Guid>.Empty;

    public Guid? FirstPlayerId { get; init; }
    public ChallengeState? ActiveChallenge { get; init; }

    /// <summary>What the engine is waiting on. Null when auto-advancing.</summary>
    public PromptState? ActivePrompt { get; init; }

    /// <summary>Tracks where in the current phase the engine is.</summary>
    public PhaseContext? PhaseContext { get; init; }

    /// <summary>If we're inside an ability window, this describes it.</summary>
    public AbilityWindowState? AbilityWindow { get; init; }

    /// <summary>Stack of pending events waiting to resolve (for nested windows).</summary>
    public ImmutableStack<PendingEvent> EventStack { get; init; } = ImmutableStack<PendingEvent>.Empty;

    public Guid? WinnerId { get; init; }
    public string? WinReason { get; init; }

    /// <summary>Seeded RNG state -- advanced by each random operation.</summary>
    public long RandomSeed { get; init; }

    /// <summary>Game log entries.</summary>
    public ImmutableList<LogEntry> Log { get; init; } = ImmutableList<LogEntry>.Empty;

    // --- Convenience methods ---

    public PlayerState GetPlayer(Guid playerId) =>
        Players.First(p => p.PlayerId == playerId);

    public PlayerState? TryGetPlayer(Guid playerId) =>
        Players.FirstOrDefault(p => p.PlayerId == playerId);

    public CardInstance? FindCard(Guid instanceId)
    {
        foreach (var player in Players)
        {
            var card = player.FindCard(instanceId);
            if (card != null) return card;
        }
        return null;
    }

    public IEnumerable<CardInstance> AllCardsInPlay() =>
        Players.SelectMany(p => p.CardsInPlay);

    public GameState UpdatePlayer(Guid playerId, Func<PlayerState, PlayerState> update) =>
        this with { Players = Players.Replace(GetPlayer(playerId), update(GetPlayer(playerId))) };

    public GameState UpdateCard(Guid instanceId, Func<CardInstance, CardInstance> update)
    {
        var updated = this;
        foreach (var player in Players)
        {
            var card = player.FindCard(instanceId);
            if (card != null)
            {
                updated = updated.UpdatePlayer(player.PlayerId, p => p.UpdateCard(instanceId, update));
                break;
            }
        }
        return updated;
    }

    public GameState AddLogEntry(string message) =>
        this with { Log = Log.Add(new LogEntry(DateTimeOffset.UtcNow, message)) };

    public static GameState CreateNew(Guid gameId, GameFormat format) => new()
    {
        GameId = gameId,
        Phase = GamePhase.Setup,
        Status = GameStatus.WaitingForPlayers,
        Format = format,
    };
}

public sealed record PendingEvent(string EventId, string EventType, string EventDataJson);

public sealed record LogEntry(DateTimeOffset Timestamp, string Message);
