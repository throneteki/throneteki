class KillTracker {
    constructor(game) {
        this.killedThisPhase = [];
        this.killedThisRound = [];

        game.on('onCharacterKilled', (event) => {
            this.killedThisPhase.push(event);
            this.killedThisRound.push(event);
        });
        game.on('onPhaseEnded', () => (this.killedThisPhase = []));
        game.on('onRoundEnded', () => (this.killedThisRound = []));
    }

    anyKilledThisPhase(condition = () => true) {
        return this.killedThisPhase.some((event) => condition(event.cardStateWhenKilled));
    }

    wasKilledThisPhase(card) {
        return this.killedThisPhase.some((event) => event.card === card);
    }

    getCardsKilledThisPhase(condition = () => true) {
        return this.killedThisPhase
            .filter((event) => condition(event.card))
            .map((event) => event.card);
    }

    anyKilledThisRound(condition = () => true) {
        return this.killedThisRound.some((event) => condition(event.cardStateWhenKilled));
    }
}

export default KillTracker;
