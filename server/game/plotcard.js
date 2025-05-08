import BaseCard from './basecard.js';
import CardWhenRevealed from './cardwhenrevealed.js';
import CardStat from './cardstat.js';

class PlotCard extends BaseCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        const printedIncome = this.getPrintedNumberFor(this.cardData.plotStats?.income);
        this.income = new CardStat(printedIncome);
        const printedInitiative = this.getPrintedNumberFor(this.cardData.plotStats?.initiative);
        this.initiative = new CardStat(printedInitiative);
        const printedClaim = this.getPrintedNumberFor(this.cardData.plotStats?.claim);
        this.claim = new CardStat(printedClaim);
        const printedReserve = this.getPrintedNumberFor(this.cardData.plotStats?.reserve);
        this.reserve = new CardStat(printedReserve);
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
export default PlotCard;