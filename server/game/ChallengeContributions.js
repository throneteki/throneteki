import { Flags } from './Constants/index.js';

export class ChallengeContributions {
    constructor() {
        this.contributions = [];
    }

    addParticipants(participants, towardsPlayer) {
        this.contributions = this.contributions.concat(
            participants.map((card) => new CharacterStrengthContribution(towardsPlayer, card, true))
        );
        this.refresh(participants);
    }

    removeParticipants(participants) {
        this.contributions = this.contributions.filter(
            (c) =>
                !(
                    c instanceof CharacterStrengthContribution &&
                    c.isParticipation &&
                    participants.includes(c.card)
                )
        );
        this.refresh(participants);
    }

    addContribution(contribution) {
        this.contributions.push(contribution);
        this.refresh([contribution.card]);
    }

    removeContribution(contribution) {
        let index = this.contributions.indexOf(contribution);
        if (index >= 0) {
            this.contributions.splice(index, 1);
        }
        this.refresh([contribution.card]);
    }

    clear(cards) {
        cards = cards || this.contributions.map((c) => c.card);
        this.contributions = this.contributions.filter((c) => !cards.includes(c.card));
        this.refresh(cards);
    }

    refresh(cards) {
        cards = cards || this.contributions.map((c) => c.card);
        for (let card of cards) {
            card.isContributing = this.isContributing(card);

            // Updating character contributions for that card to ensure only latest is applied
            let characterContributions = this.contributions
                .filter((c) => c instanceof CharacterStrengthContribution && c.card === card)
                .reverse();
            for (let index in characterContributions) {
                characterContributions[index].isLatest = index === '0';
            }
        }
    }

    isContributing(card) {
        return this.contributions.some((c) => c.card === card);
    }

    getTotalFor(player) {
        return this.contributions
            .filter((c) => c.towardsPlayer === player)
            .reduce((sum, c) => {
                if (!c.isActive()) {
                    return sum;
                }

                return sum + c.getStrength();
            }, 0);
    }
}

export class ValueContribution {
    constructor(towardsPlayer, card, value) {
        this.towardsPlayer = towardsPlayer;
        this.card = card;
        this.value = value;

        this.card.isContributing = true;
    }

    isActive() {
        return true;
    }

    getStrength() {
        return this.value;
    }
}

export class CharacterStrengthContribution {
    constructor(towardsPlayer, card, isParticipation = false) {
        this.towardsPlayer = towardsPlayer;
        this.card = card;
        this.isParticipation = isParticipation;
        this.isLatest = true;

        this.card.isContributing = true;
    }

    isActive() {
        if (this.isLatest && !this.card.hasFlag(Flags.challengeOptions.doesNotContributeStrength)) {
            return true;
        }
        return false;
    }

    getStrength() {
        return this.card.getStrength();
    }
}
