import BaseCard from './basecard.js';
import CardWhenRevealed from './cardwhenrevealed.js';

class PlotCard extends BaseCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        const printedIncome = this.getPrintedNumberFor(this.cardData.plotStats?.income);
        this.income = new PlotStat(printedIncome);
        const printedInitiative = this.getPrintedNumberFor(this.cardData.plotStats?.initiative);
        this.initiative = new PlotStat(printedInitiative);
        const printedClaim = this.getPrintedNumberFor(this.cardData.plotStats?.claim);
        this.claim = new PlotStat(printedClaim);
        const printedReserve = this.getPrintedNumberFor(this.cardData.plotStats?.reserve);
        this.reserve = new PlotStat(printedReserve);
    }

    whenRevealed(properties) {
        const condition = properties.condition || (() => true);
        let whenClause = {
            when: {
                onPlotRevealed: (event, context) => event.plot === this && condition(context)
            }
        };
        let reaction = new CardWhenRevealed(this.game, this, Object.assign(whenClause, properties));
        this.abilities.reactions.push(reaction);
    }

    getWhenRevealedAbility() {
        return this.abilities.reactions.find((ability) => ability instanceof CardWhenRevealed);
    }

    getIncome() {
        return this.income.calculate();
    }

    getInitiative() {
        return this.initiative.calculate();
    }

    getClaim() {
        return this.claim.calculate();
    }

    getReserve() {
        return this.reserve.calculate();
    }

    flipFaceup() {
        // This probably isn't necessary now
        this.facedown = false;

        // But this is
        this.selected = false;
    }
}

export class PlotStat {
    constructor(printedValue) {
        this.printedValue = printedValue;
        this.baseValue = this.printedValue;
        this.modifiers = [];
        // TODO: Improve modifiers so that other cards apply a "PlotStatModifier" which is collected here & used in calculate
        //       Would make affecting that modified stat (eg. Rains of Autumn) much simpler
        this.modifier = 0;
        this.setValue = null;
    }

    calculate() {
        if (typeof this.setValue !== 'number') {
            return Math.max(this.baseValue + this.modifier, 0);
        }
        return this.setValue;
    }
}

export default PlotCard;
