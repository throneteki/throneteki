using System.Collections.Immutable;
using Throneteki.Domain.Enums;
using Throneteki.Domain.Models.GameAggregate;

namespace Throneteki.Domain.Tests.Helpers;

/// <summary>
/// Fluent builder for constructing GameState objects in tests.
/// Eliminates boilerplate and makes tests readable.
/// </summary>
public sealed class GameStateBuilder
{
    private Guid _gameId = Guid.NewGuid();
    private GamePhase _phase = GamePhase.Setup;
    private GameStatus _status = GameStatus.InProgress;
    private GameFormat _format = GameFormat.Joust;
    private int _round = 1;
    private readonly List<PlayerStateBuilder> _players = new();

    public GameStateBuilder WithGameId(Guid id) { _gameId = id; return this; }
    public GameStateBuilder WithPhase(GamePhase phase) { _phase = phase; return this; }
    public GameStateBuilder WithRound(int round) { _round = round; return this; }
    public GameStateBuilder WithFormat(GameFormat format) { _format = format; return this; }

    public GameStateBuilder WithPlayer(string username, Action<PlayerStateBuilder>? configure = null)
    {
        var builder = new PlayerStateBuilder(username);
        configure?.Invoke(builder);
        _players.Add(builder);
        return this;
    }

    public GameStateBuilder WithPlayers(params string[] usernames)
    {
        foreach (var name in usernames) WithPlayer(name);
        return this;
    }

    public GameState Build()
    {
        var players = _players.Select(b => b.Build()).ToImmutableList();
        return new GameState
        {
            GameId = _gameId,
            Phase = _phase,
            Status = _status,
            Format = _format,
            RoundNumber = _round,
            Players = players,
            PlayerOrder = players.Select(p => p.PlayerId).ToImmutableList(),
        };
    }
}

public sealed class PlayerStateBuilder
{
    public Guid PlayerId { get; } = Guid.NewGuid();
    private readonly string _username;
    private readonly List<CardInstance> _drawDeck = new();
    private readonly List<CardInstance> _hand = new();
    private readonly List<CardInstance> _cardsInPlay = new();
    private readonly List<CardInstance> _plotDeck = new();
    private int _gold;
    private int _factionPower;
    private bool _isFirstPlayer;

    public PlayerStateBuilder(string username) => _username = username;

    public PlayerStateBuilder WithGold(int gold) { _gold = gold; return this; }
    public PlayerStateBuilder AsFirstPlayer() { _isFirstPlayer = true; return this; }

    public PlayerStateBuilder WithDrawDeck(params string[] cardCodes)
    {
        foreach (var code in cardCodes)
            _drawDeck.Add(MakeCard(code, CardLocation.DrawDeck));
        return this;
    }

    public PlayerStateBuilder WithHand(params string[] cardCodes)
    {
        foreach (var code in cardCodes)
            _hand.Add(MakeCard(code, CardLocation.Hand));
        return this;
    }

    public PlayerStateBuilder InPlay(string cardCode, Action<CardInstanceBuilder>? configure = null)
    {
        var builder = new CardInstanceBuilder(cardCode, CardLocation.PlayArea, PlayerId);
        configure?.Invoke(builder);
        _cardsInPlay.Add(builder.Build());
        return this;
    }

    public PlayerStateBuilder InPlayExact(CardInstance card)
    {
        _cardsInPlay.Add(card);
        return this;
    }

    public PlayerStateBuilder WithPlotDeck(params string[] cardCodes)
    {
        foreach (var code in cardCodes)
            _plotDeck.Add(MakeCard(code, CardLocation.PlotDeck));
        return this;
    }

    private CardInstance? _activePlot;

    public PlayerStateBuilder WithActivePlot(string cardCode)
    {
        _activePlot = MakeCard(cardCode, CardLocation.ActivePlot);
        return this;
    }

    private CardInstance MakeCard(string code, CardLocation location) => new()
    {
        InstanceId = Guid.NewGuid(),
        CardCode = code,
        OwnerId = PlayerId,
        ControllerId = PlayerId,
        Location = location,
    };

    public PlayerState Build() => new()
    {
        PlayerId = PlayerId,
        Username = _username,
        Gold = _gold,
        FactionPower = _factionPower,
        IsFirstPlayer = _isFirstPlayer,
        DrawDeck = _drawDeck.ToImmutableList(),
        Hand = _hand.ToImmutableList(),
        CardsInPlay = _cardsInPlay.ToImmutableList(),
        PlotDeck = _plotDeck.ToImmutableList(),
        ActivePlot = _activePlot,
        Faction = MakeCard("faction", CardLocation.PlayArea),
    };
}

public sealed class CardInstanceBuilder(string code, CardLocation location, Guid ownerId)
{
    private Guid _id = Guid.NewGuid();
    private int _power;
    private bool _kneeled;
    private readonly List<Guid> _duplicates = new();

    private int _strengthModifier;

    public CardInstanceBuilder WithId(Guid id) { _id = id; return this; }
    public CardInstanceBuilder WithPower(int power) { _power = power; return this; }
    public CardInstanceBuilder WithStrengthModifier(int mod) { _strengthModifier = mod; return this; }
    public CardInstanceBuilder Kneeled() { _kneeled = true; return this; }

    public CardInstanceBuilder WithDuplicate(string dupeCode = "")
    {
        _duplicates.Add(Guid.NewGuid());
        return this;
    }

    public CardInstance Build() => new()
    {
        InstanceId = _id,
        CardCode = code,
        OwnerId = ownerId,
        ControllerId = ownerId,
        Location = location,
        Power = _power,
        Kneeled = _kneeled,
        StrengthModifier = _strengthModifier,
        Duplicates = _duplicates.ToImmutableList(),
    };
}
