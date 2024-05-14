const DrawCard = require('../../drawcard.js');

class WillasTyrell extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Kneel Willas and stand/give keywords',
            condition: () => !this.kneeled,
            handler: () => {
                let partials = [];

                this.controller.kneelCard(this);

                let margaery = this.controller.cardsInPlay.find(
                    (card) => card.name === 'Margaery Tyrell'
                );
                if (margaery && margaery.kneeled) {
                    this.controller.standCard(margaery);
                    partials.push('stands {2}');
                }

                let flowers = this.controller.cardsInPlay.find(
                    (card) => card.name === 'The Knight of Flowers'
                );
                if (flowers) {
                    this.untilEndOfPhase((ability) => ({
                        match: flowers,
                        effect: ability.effects.addKeyword('insight')
                    }));
                    partials.push('gives insight to {3}');
                }

                let garlan = this.controller.cardsInPlay.find(
                    (card) => card.name === 'Ser Garlan Tyrell'
                );
                if (garlan) {
                    this.untilEndOfPhase((ability) => ({
                        match: garlan,
                        effect: ability.effects.addKeyword('renown')
                    }));
                    partials.push('gives renown to {4}');
                }

                let formattedPartials = this.formatPartials(partials);
                this.game.addMessage(
                    '{0} uses {1} to kneel {1}' + formattedPartials,
                    this.controller,
                    this,
                    margaery,
                    flowers,
                    garlan
                );
            }
        });
    }

    formatPartials(partials) {
        if (partials.length === 0) {
            return '';
        }

        if (partials.length === 1) {
            return ', then ' + partials[0];
        }

        if (partials.length === 2) {
            return ', then ' + partials[0] + ' and ' + partials[1];
        }

        if (partials.length === 3) {
            return ', then ' + partials[0] + ', ' + partials[1] + ' and ' + partials[2];
        }
    }
}

WillasTyrell.code = '09008';

module.exports = WillasTyrell;
