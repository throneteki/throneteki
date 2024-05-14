class Claim {
    static createFromChallenge(challenge) {
        let claim = new Claim();
        claim.challengeType = challenge.challengeType;
        claim.recipients = [challenge.loser];
        claim.value = challenge.getClaim();
        claim.winner = challenge.winner;

        return claim;
    }

    constructor() {
        this.challengeType = null;
        this.recipients = [];
        this.value = 0;
        this.winner = null;
    }

    allowMultipleOpponentClaim() {
        return this.winner.allowMultipleOpponentClaim(this.challengeType);
    }

    addRecipient(player) {
        if (this.recipients.includes(player)) {
            return;
        }

        this.recipients.push(player);
    }

    replaceRecipient(origPlayer, newPlayer) {
        this.recipients = this.recipients
            .filter((player) => player !== origPlayer)
            .concat(newPlayer);
    }

    clone() {
        let clone = new Claim();
        clone.challengeType = this.challengeType;
        clone.recipients = [...this.recipients];
        clone.value = this.value;
        clone.winner = this.winner;
        return clone;
    }
}

export default Claim;
