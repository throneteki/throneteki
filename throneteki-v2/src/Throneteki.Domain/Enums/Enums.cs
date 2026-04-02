namespace Throneteki.Domain.Enums;

public enum CardType { Character, Location, Attachment, Event, Plot, Faction, Agenda, Title }

public enum Faction
{
    Stark, Lannister, Baratheon, Targaryen, Greyjoy, Martell, Tyrell, NightsWatch, Neutral
}

public enum ChallengeIcon { Military, Intrigue, Power }

public enum CardLocation
{
    Hand, DrawDeck, PlotDeck, PlayArea, DiscardPile, DeadPile, Shadows, OutOfGame,
    BeingPlayed, ActivePlot, RevealedPlots, Duplicate, Attachment, Title
}

public enum GamePhase { Setup, Plot, Draw, Marshalling, Challenges, Dominance, Standing, Taxation }

public enum GameStatus { WaitingForPlayers, InProgress, Completed, Abandoned }

public enum GameMode { RealTime, Async }

public enum GameFormat { Joust, Melee }

public enum AbilityWindowType
{
    CancelInterrupt, ForcedInterrupt, Interrupt,
    WhenRevealed,
    ForcedReaction, Reaction
}

public enum PowerTargetType { Card, Player }

public enum DeckCardType { DrawDeck, PlotDeck }

public enum Keyword
{
    Stealth, Insight, Renown, Ambush, Shadow, Pillage, Intimidate, Bestow,
    Limited, Terminal, Immune, NoAttachments
}

public enum RestrictionType
{
    CannotBeKilled, CannotBeDiscarded, CannotKneel, CannotStand, CannotGainPower,
    CannotTriggerAbilities, CannotInitiateChallenge, CannotParticipateAsAttacker,
    CannotParticipateAsDefender, CannotBeTargeted, MustFightAlone
}
