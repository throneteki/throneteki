const DrawCard = require('../../drawcard.js');

class HotahsAxe extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.modifyStrength(3)
        });

        this.reaction({
            when: {
                //Not seeing any value in being able to attach this to opponent's characters
                onCardEntersPlay: (event) =>
                    event.card.controller === this.controller &&
                    event.card.isFaction('martell') &&
                    event.card.getType() === 'character' &&
                    this.controller.canAttach(this, event.card) &&
                    event.card.location === 'play area' &&
                    this.game.currentPhase === 'challenge'
            },
            location: 'hand',
            handler: (context) => {
                this.controller.attach(context.player, this, context.event.card, 'play');
                this.game.addMessage(
                    '{0} puts {1} into play and attaches it to {2}',
                    context.player,
                    this,
                    context.event.card
                );
            }
        });
    }
}

HotahsAxe.code = '10019';

module.exports = HotahsAxe;
