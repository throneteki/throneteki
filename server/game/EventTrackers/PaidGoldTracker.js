class PaidGoldTracker {
    constructor(game) {
        this.payments = [];

        game.on('onGoldTransferred', (event) => this.recordPayment(event));
        game.on('onPhaseStarted', () => this.clearPayments());
    }

    recordPayment(event) {
        this.payments.push(event);
    }

    clearPayments() {
        this.payments = [];
    }

    hasPaid(payer, recipient) {
        return this.payments.some(
            (event) => event.source === payer && event.target === recipient && event.amount > 0
        );
    }
}

export default PaidGoldTracker;
