import Player from './player.js';
import EventRegistrar from './eventregistrar.js';
import Settings from '../settings.js';
import ChallengeMatcher from './ChallengeMatcher.js';
import { ChallengeContributions } from './ChallengeContributions.js';
import { Flags } from './Constants/index.js';

class Challenge {
    constructor(game, properties) {
        this.game = game;
        this.initiatingPlayer = properties.attackingPlayer;
        this.attackingPlayer = properties.attackingPlayer;
        this.isSinglePlayer = !properties.defendingPlayer;
        this.defendingPlayer = properties.defendingPlayer || this.singlePlayerDefender();
        this.initiatedAgainstPlayer = this.defendingPlayer;
        this.isInitiated = properties.isInitiated || false;
        this.initiatedChallengeType = properties.challengeType;
        this.challengeType = properties.challengeType;
        this.number = properties.number;
        this.totalNumber = properties.totalNumber;
        this.attackers = [];
        this.declaredAttackers = [];
        this.attackerStrength = 0;
        this.defenders = [];
        this.declaredDefenders = [];
        this.defenderStrength = 0;
        this.challengeContributions = new ChallengeContributions();
        this.initiationActions = [];
        this.events = new EventRegistrar(game, this);
        this.registerEvents(['onCardLeftPlay']);
    }

    get declareDefendersFirst() {
        return this.game.flags.contains(Flags.game.declareDefendersBeforeAttackers);
    }

    singlePlayerDefender() {
        const dummyPlayer = new Player(
            '',
            Settings.getUserWithDefaultsSet({ name: 'Dummy Player' }),
            false,
            this.game
        );
        dummyPlayer.initialise();
        dummyPlayer.resetForStartOfRound();
        dummyPlayer.isFake = true;
        return dummyPlayer;
    }

    resetCards() {
        this.attackingPlayer.resetForChallenge();
        this.defendingPlayer.resetForChallenge();
    }

    initiateChallenge() {
        this.attackingPlayer.trackChallenge(this);
        this.defendingPlayer.trackChallenge(this);
        this.isInitiated = true;
    }

    redirectChallengeTo(player) {
        this.defendingPlayer = player;
        this.initiatedAgainstPlayer = player;
        this.initiationActions = [];
    }

    declareAttackers(attackers) {
        this.addAttackers(attackers);
        this.declaredAttackers = this.declaredAttackers.concat(attackers);
    }

    addAttackers(attackers) {
        this.attackers = this.attackers.concat(attackers);
        this.challengeContributions.addParticipants(attackers, this.attackingPlayer);
        this.markAsParticipating(attackers);
        this.calculateStrength();
    }

    addAttacker(attacker) {
        this.addAttackers([attacker]);
    }

    declareDefenders(defenders) {
        this.addDefenders(defenders);
        this.declaredDefenders = this.declaredDefenders.concat(defenders);
    }

    addDefenders(defenders) {
        this.defenders = this.defenders.concat(defenders);
        this.challengeContributions.addParticipants(defenders, this.defendingPlayer);
        this.markAsParticipating(defenders);
        this.calculateStrength();
    }

    addDefender(defender) {
        this.addDefenders([defender]);
    }

    removeFromChallenge(card) {
        if (!this.isParticipating(card)) {
            return;
        }
        const eventProps = {
            card,
            challenge: this,
            isAttacking: this.isAttacking(card),
            isDeclared: this.isDeclared(card),
            isDefending: this.isDefending(card)
        };

        this.attackers = this.attackers.filter((c) => c !== card);
        this.declaredAttackers = this.declaredAttackers.filter((c) => c !== card);
        this.defenders = this.defenders.filter((c) => c !== card);
        this.declaredDefenders = this.declaredDefenders.filter((c) => c !== card);

        card.inChallenge = false;

        this.challengeContributions.removeParticipants([card]);

        this.calculateStrength();

        this.game.raiseEvent('onRemovedFromChallenge', eventProps);
    }

    markAsParticipating(cards) {
        for (let card of cards) {
            card.inChallenge = true;
            card.markAsDirty();
        }
    }

    isDeclared(card) {
        return this.declaredAttackers.includes(card);
    }

    isAttacking(card) {
        return this.isInitiated && this.attackers.includes(card);
    }

    isDefending(card) {
        return this.isInitiated && this.defenders.includes(card);
    }

    isParticipating(card) {
        return this.isAttacking(card) || this.isDefending(card);
    }

    isContributing(card) {
        return this.challengeContributions.isContributing(card);
    }

    getParticipants() {
        return this.attackers.concat(this.defenders);
    }

    anyParticipants(predicate) {
        let participants = this.attackers.concat(this.defenders);
        return participants.some(predicate);
    }

    hasSingleParticipant(player) {
        if (this.attackingPlayer === player) {
            return this.attackers.length === 1;
        }

        return this.defenders.length === 1;
    }

    getNumberOfParticipants(predicate = () => true) {
        let participants = this.attackers.concat(this.defenders);
        return participants.reduce((count, card) => {
            if (predicate(card)) {
                return count + 1;
            }

            return count;
        }, 0);
    }

    addInitiationAction(action, properties) {
        this.initiationActions.push({ action, properties });
    }

    calculateStrength() {
        if (this.winnerDetermined) {
            return;
        }

        this.attackerStrength = this.challengeContributions.getTotalFor(this.attackingPlayer);
        this.defenderStrength = this.challengeContributions.getTotalFor(this.defendingPlayer);
    }

    addParticipantToSide(player, card) {
        if (this.attackingPlayer === player) {
            this.addAttacker(card);
        } else {
            this.addDefender(card);
        }
    }

    addContribution(contribution) {
        this.challengeContributions.addContribution(contribution);
        this.calculateStrength();
    }

    removeContribution(contribution) {
        this.challengeContributions.removeContribution(contribution);
        this.calculateStrength();
    }

    determineWinner() {
        this.calculateStrength();

        this.winnerDetermined = true;

        let result = this.checkNoWinnerOrLoser();
        if (result.noWinner) {
            this.noWinnerMessage = result.message;
            this.loser = undefined;
            this.winner = undefined;
            this.loserStrength = this.winnerStrength = 0;
            this.strengthDifference = 0;

            return;
        }

        if (this.attackerStrength >= this.defenderStrength) {
            this.loser = this.defendingPlayer;
            this.loserStrength = this.defenderStrength;
            this.winner = this.attackingPlayer;
            this.winnerStrength = this.attackerStrength;
        } else {
            this.loser = this.attackingPlayer;
            this.loserStrength = this.attackerStrength;
            this.winner = this.defendingPlayer;
            this.winnerStrength = this.defenderStrength;
        }

        this.strengthDifference = this.winnerStrength - this.loserStrength;
    }

    checkNoWinnerOrLoser() {
        const noWinnerRules = [
            {
                condition: () => this.attackerStrength === 0 && this.defenderStrength === 0,
                message:
                    'There is no winner or loser for this challenge because the attacker strength is 0'
            },
            {
                condition: () =>
                    this.attackerStrength >= this.defenderStrength &&
                    this.attackingPlayer.hasFlag(Flags.player.cannotWinChallenge),
                message:
                    'There is no winner or loser for this challenge because the attacker cannot win'
            },
            {
                condition: () =>
                    this.attackerStrength >= this.defenderStrength && this.attackers.length === 0,
                message:
                    'There is no winner or loser for this challenge because the attacker has no participants'
            },
            {
                condition: () =>
                    this.defenderStrength > this.attackerStrength &&
                    this.defendingPlayer.hasFlag(Flags.player.cannotWinChallenge),
                message:
                    'There is no winner or loser for this challenge because the defender cannot win'
            },
            {
                condition: () =>
                    this.defenderStrength > this.attackerStrength && this.defenders.length === 0,
                message:
                    'There is no winner or loser for this challenge because the defender has no participants'
            }
        ];

        return (
            noWinnerRules
                .map((rule) => ({ noWinner: !!rule.condition(), message: rule.message }))
                .find((match) => match.noWinner) || { noWinner: false }
        );
    }

    isAttackerTheWinner() {
        return this.winner === this.attackingPlayer;
    }

    isUnopposed() {
        return (
            this.loserStrength <= 0 &&
            this.winnerStrength > 0 &&
            this.winner === this.attackingPlayer
        );
    }

    isRivalWin() {
        return this.winner && this.loser && this.winner.canGainRivalBonus(this.loser);
    }

    getClaim() {
        return this.winner.getClaim();
    }

    getWinnerCards() {
        if (this.winner === this.attackingPlayer) {
            return this.attackers;
        } else if (this.winner === this.defendingPlayer) {
            return this.defenders;
        }

        return [];
    }

    getOpponentCards(player) {
        return this.attackingPlayer === player ? this.defenders : this.attackers;
    }

    onCardLeftPlay(event) {
        this.removeFromChallenge(event.card);
        this.challengeContributions.clear([event.card]);
    }

    registerEvents(events) {
        this.events.register(events);
    }

    unregisterEvents() {
        this.events.unregisterAll();
    }

    finish() {
        for (let card of this.attackers.concat(this.defenders)) {
            card.inChallenge = false;
        }
        this.challengeContributions.clear();

        this.isInitiated = false;
    }

    cancelChallenge() {
        this.cancelled = true;
        this.isInitiated = false;

        this.resetCards();

        this.game.addMessage(
            "{0}'s {1} challenge is cancelled",
            this.attackingPlayer,
            this.challengeType
        );
    }

    isMatch(matchers) {
        return ChallengeMatcher.isMatch(this, matchers);
    }
}

export default Challenge;
