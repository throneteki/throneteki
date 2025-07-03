import range from 'lodash.range';
import BaseStep from '../gamesteps/basestep.js';

class XValuePrompt extends BaseStep {
    constructor(min, max, context) {
        super();

        this.min = min;
        this.max = max;
        this.context = context;
    }

    continue() {
        if (this.min >= this.max) {
            this.resolveCost(this.context.player, this.max);
            return;
        }

        let rangeArray = range(this.min, this.max + 1)
            .reverse()
            .map((xValue) => xValue.toString());

        this.context.game.promptWithMenu(this.context.player, this, {
            activePrompt: {
                menuTitle: 'Select value of X',
                controls: [
                    {
                        type: 'select-from-values',
                        command: 'menuButton',
                        method: 'resolveCost',
                        selectableValues: rangeArray
                    }
                ]
            },
            source: this.context.source
        });
    }

    resolveCost(player, xValue) {
        //if the xValue is undefined, return false will prompt the player again
        if (!xValue && xValue !== 0) {
            return false;
        }
        //value selected in prompt is of type string
        xValue = typeof xValue === 'string' ? parseInt(xValue) : xValue;

        if (xValue < this.min || xValue > this.max) {
            return false;
        }

        this.context.xValue = xValue;

        return true;
    }
}

export default XValuePrompt;
