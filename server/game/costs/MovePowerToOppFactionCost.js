class MovePowerToOppFactionCost {
    constructor(opponent, amount) {
        this.name = 'movePowerToOppFactionCost';
        this.opponent = opponent;
        this.amount = amount;
    }

    getAmountValue(context) {
        return (this.amount === 'X' ? context.xValue : this.amount) || 1;
    }

    isEligible(card, context) {
        return ['faction', 'play area'].includes(card.location) && card.getPower() >= this.getAmountValue(context);
    }

    pay(cards, context) {
        let amount = this.getAmountValue(context);
        for(let card of cards) {
            card.modifyPower(-amount);
        }
        if(typeof this.opponent === 'function') {
            let opp = this.opponent(context);
            opp.game.addPower(opp, amount);
        } else {
            this.opponent.game.addPower(this.opponent, amount);
        }        
    }
}

module.exports = MovePowerToOppFactionCost;
