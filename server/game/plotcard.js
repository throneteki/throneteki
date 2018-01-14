const _ = require('underscore');

const BaseCard = require('./basecard.js');
const CardWhenRevealed = require('./cardwhenrevealed.js');

class PlotCard extends BaseCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.reserveModifier = 0;
        this.goldModifier = 0;
        this.initiativeModifier = 0;
        this.claimModifier = 0;
        this.claimSet = undefined;
    }

    whenRevealed(properties) {
        let whenClause = {
            when: {
                onPlotsWhenRevealed: event => event.plots.includes(this)
            }
        };
        let reaction = new CardWhenRevealed(this.game, this, _.extend(whenClause, properties));
        this.abilities.reactions.push(reaction);
    }

    hasRevealEffect() {
        return this.cardData.text && this.cardData.text.indexOf('When Revealed:') !== -1;
    }

    getInitiative() {
        var baseValue = this.canProvidePlotModifier['initiative'] ? this.cardData.initiative : 0;
        return baseValue + this.initiativeModifier;
    }

    getIncome() {
        let baseValue = this.canProvidePlotModifier['gold'] ? (this.baseIncome || this.getPrintedIncome()) : 0;

        return baseValue + this.goldModifier;
    }

    getPrintedIncome() {
        return this.cardData.income;
    }

    getReserve() {
        var baseValue = this.canProvidePlotModifier['reserve'] ? this.cardData.reserve : 0;
        return baseValue + this.reserveModifier;
    }

    getPrintedClaim() {
        return this.cardData.claim || 0;
    }

    getClaim() {
        let baseClaim = this.getPrintedClaim();

        if(_.isNumber(this.claimSet)) {
            return this.claimSet;
        }

        return Math.max(baseClaim + this.claimModifier, 0);
    }

    flipFaceup() {
        // This probably isn't necessary now
        this.facedown = false;

        // But this is
        this.selected = false;
    }
}

module.exports = PlotCard;
