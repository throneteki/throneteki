const ChallengeTypes = ['military', 'intrigue', 'power'];

function byChallengeType() {
    return Object.fromEntries(ChallengeTypes.map((type) => [type, 0]));
}

/**
 * Collects per-player statistics for a game by listening to resolved game events.
 * Setup is ignored so the starting hand and setup gold aren't counted, and stats stop
 * being recorded once the game is over so games that carry on after a win don't
 * inflate the numbers.
 */
class GameStats {
    constructor(game) {
        this.game = game;
        this.players = {};

        const handlers = {
            onCardMarshalled: (event) => this.onCardMarshalled(event),
            onCardOutOfShadows: (event) => this.onCardOutOfShadows(event),
            onCardPlayed: (event) => this.onCardPlayed(event),
            onCardPowerGained: (event) => this.onCardPowerGained(event),
            onCardsDrawn: (event) => this.onCardsDrawn(event),
            onCardDiscarded: (event) => this.onCardDiscarded(event),
            onChallengeInitiated: (event) => this.onChallengeInitiated(event),
            onChallengeFinished: (event) => this.onChallengeFinished(event),
            onCharacterKilled: (event) => this.onCharacterKilled(event),
            onClaimApplied: (event) => this.onClaimApplied(event),
            onDominanceDetermined: (event) => this.onDominanceDetermined(event),
            onGoldGained: (event) => this.onGoldGained(event),
            onInitiativeDetermined: (event) => this.onInitiativeDetermined(event),
            onPlotRevealed: (event) => this.onPlotRevealed(event),
            onSacrificed: (event) => this.onSacrificed(event)
        };

        for (const [eventName, handler] of Object.entries(handlers)) {
            game.on(eventName, (event) => {
                if (event.cancelled || this.game.isGameOver || this.game.currentPhase === 'setup') {
                    return;
                }

                handler(event);
            });
        }
    }

    forPlayer(player) {
        if (!player || !player.name) {
            return null;
        }

        if (!this.players[player.name]) {
            this.players[player.name] = {
                cards: {},
                cardsDiscardedFromHand: 0,
                cardsDrawn: 0,
                cardsMarshalled: 0,
                cardsMarshalledByType: {},
                cardsOutOfShadows: 0,
                cardsSacrificed: 0,
                challengesInitiated: byChallengeType(),
                challengesLost: byChallengeType(),
                challengesWon: byChallengeType(),
                charactersKilled: 0,
                claimsApplied: 0,
                dominanceWon: 0,
                eventsPlayed: 0,
                goldGained: 0,
                initiativeWon: 0,
                powerFromRenown: 0,
                powerGained: 0,
                unopposedChallengesWon: 0
            };
        }

        return this.players[player.name];
    }

    forCard(player, card) {
        const stats = this.forPlayer(player);
        if (!stats || !card || !card.code) {
            return null;
        }

        if (!stats.cards[card.code]) {
            stats.cards[card.code] = {
                attacked: 0,
                defended: 0,
                killed: 0,
                marshalled: 0,
                played: 0,
                revealed: 0
            };
        }

        return stats.cards[card.code];
    }

    onCardMarshalled(event) {
        const stats = this.forPlayer(event.player);
        if (!stats) {
            return;
        }

        const type = event.card.getType();
        stats.cardsMarshalled++;
        stats.cardsMarshalledByType[type] = (stats.cardsMarshalledByType[type] || 0) + 1;
        this.forCard(event.player, event.card).marshalled++;
    }

    onCardOutOfShadows(event) {
        const stats = this.forPlayer(event.player);
        if (stats) {
            stats.cardsOutOfShadows++;
        }
    }

    onCardPlayed(event) {
        const stats = this.forPlayer(event.player);
        if (!stats) {
            return;
        }

        stats.eventsPlayed++;
        this.forCard(event.player, event.card).played++;
    }

    onCardPowerGained(event) {
        const stats = this.forPlayer(event.card.controller);
        if (!stats) {
            return;
        }

        stats.powerGained += event.power;
        if (event.reason === 'renown') {
            stats.powerFromRenown += event.power;
        }
    }

    onCardsDrawn(event) {
        const stats = this.forPlayer(event.player);
        if (stats && event.amount > 0) {
            stats.cardsDrawn += event.amount;
        }
    }

    onCardDiscarded(event) {
        if (event.originalLocation !== 'hand') {
            return;
        }

        const stats = this.forPlayer(event.card.controller);
        if (stats) {
            stats.cardsDiscardedFromHand++;
        }
    }

    onChallengeInitiated(event) {
        const { challenge } = event;
        const stats = this.forPlayer(challenge.attackingPlayer);
        if (stats && ChallengeTypes.includes(challenge.challengeType)) {
            stats.challengesInitiated[challenge.challengeType]++;
        }
    }

    onChallengeFinished(event) {
        const { challenge } = event;

        for (const card of challenge.attackers) {
            const cardStats = this.forCard(challenge.attackingPlayer, card);
            if (cardStats) {
                cardStats.attacked++;
            }
        }

        for (const card of challenge.defenders) {
            const cardStats = this.forCard(challenge.defendingPlayer, card);
            if (cardStats) {
                cardStats.defended++;
            }
        }

        if (!ChallengeTypes.includes(challenge.challengeType)) {
            return;
        }

        const winner = this.forPlayer(challenge.winner);
        if (winner) {
            winner.challengesWon[challenge.challengeType]++;
            if (challenge.isUnopposed()) {
                winner.unopposedChallengesWon++;
            }
        }

        const loser = this.forPlayer(challenge.loser);
        if (loser) {
            loser.challengesLost[challenge.challengeType]++;
        }
    }

    onCharacterKilled(event) {
        const stats = this.forPlayer(event.card.controller);
        if (!stats) {
            return;
        }

        stats.charactersKilled++;
        this.forCard(event.card.controller, event.card).killed++;
    }

    onClaimApplied(event) {
        const stats = this.forPlayer(event.player);
        if (stats) {
            stats.claimsApplied++;
        }
    }

    onDominanceDetermined(event) {
        const stats = this.forPlayer(event.winner);
        if (stats) {
            stats.dominanceWon++;
        }
    }

    onGoldGained(event) {
        const stats = this.forPlayer(event.player);
        if (stats && event.amount > 0) {
            stats.goldGained += event.amount;
        }
    }

    onInitiativeDetermined(event) {
        const stats = this.forPlayer(event.winner);
        if (stats) {
            stats.initiativeWon++;
        }
    }

    onPlotRevealed(event) {
        const cardStats = this.forCard(event.plot.controller, event.plot);
        if (cardStats) {
            cardStats.revealed++;
        }
    }

    onSacrificed(event) {
        const stats = this.forPlayer(event.card.controller);
        if (stats) {
            stats.cardsSacrificed++;
        }
    }

    getPlayerStats(player) {
        return Object.assign({}, this.forPlayer(player), { rounds: this.game.round });
    }
}

export default GameStats;
