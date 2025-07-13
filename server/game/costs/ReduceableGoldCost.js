import XValuePrompt from './XValuePrompt.js';
import { MarshalIntoShadowsCost } from '../Constants/index.js';

class ReduceableGoldCost {
    constructor({ playingType }) {
        this.playingType = playingType;
    }

    canPay(context) {
        const hasDupe = context.player.getDuplicateInPlay(context.source);
        if (hasDupe && this.playingType === 'marshal') {
            return true;
        }

        const card = context.source;
        const baseCost = this.getBaseCost(this.playingType, card);
        const reduction = context.player.getCostReduction(this.playingType, card);
        const payingPlayer = context.payingPlayer;

        if (baseCost !== 'X') {
            const reducedCost = Math.max(baseCost - reduction, card.getMinCost());
            return payingPlayer.getSpendableGold({ playingType: this.playingType }) >= reducedCost;
        }

        const minValue = card.xValueDefinition.getMinValue(context);
        return payingPlayer.getSpendableGold() >= minValue - reduction;
    }

    resolve(context, result = { resolved: false }) {
        const baseCost = this.getBaseCost(this.playingType, context.source);

        if (baseCost !== 'X') {
            result.value = true;
            result.resolved = true;
            return result;
        }

        const reduction = context.player.getCostReduction(this.playingType, context.source);
        const payingPlayer = context.payingPlayer;
        let gold = payingPlayer.getSpendableGold({ playingType: this.playingType });
        let maxXValue = context.source.xValueDefinition.getMaxValue(context);
        let max = Math.min(maxXValue, gold + reduction);
        let min = context.source.xValueDefinition.getMinValue(context);

        context.game.queueStep(new XValuePrompt(min, max, context));

        result.value = true;
        result.resolved = true;
        return result;
    }

    pay(context) {
        const hasDupe = context.player.getDuplicateInPlay(context.source);
        context.costs.isDupe = !!hasDupe;
        if (hasDupe && this.playingType === 'marshal') {
            context.costs.gold = 0;
        } else {
            let baseCost = this.getBaseCost(this.playingType, context.source);
            const reduction = context.player.getCostReduction(this.playingType, context.source);
            if (baseCost !== 'X') {
                context.costs.gold = Math.max(baseCost - reduction, context.source.getMinCost());
            } else {
                context.costs.gold = Math.max(
                    context.xValue - reduction,
                    context.source.getMinCost()
                );
            }
            context.game.spendGold({
                amount: context.costs.gold,
                player: context.payingPlayer,
                playingType: this.playingType
            });
            context.player.markUsedReducers(this.playingType, context.source);
        }
    }

    getBaseCost(playingType, card) {
        if (playingType === 'marshalIntoShadows') {
            return MarshalIntoShadowsCost;
        }

        if (
            playingType === 'outOfShadows' ||
            (playingType === 'play' && card.location === 'shadows')
        ) {
            return card.getShadowCost();
        }

        if (playingType === 'ambush') {
            return card.getAmbushCost();
        }

        return card.getCost();
    }
}

export default ReduceableGoldCost;
