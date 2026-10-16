import DrawCard from '../../drawcard.js';

class TheRiverroad extends DrawCard {
    setupCardAbilities(ability) {
        this.plotModifiers({
            gold: 1
        });
        this.action({
            title: 'Give a character a challenge icon',
            cost: [ability.costs.kneelSelf(), ability.costs.sacrificeSelf()],
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'character'
            },
            handler: (context) => {
                this.game.promptForIcon(context.player, this, (icon) => {
                    this.untilEndOfPhase((ability) => ({
                        match: context.target,
                        effect: ability.effects.addIcon(icon)
                    }));

                    this.game.addMessage(
                        '{0} kneels and sacrifices {1} to have {2} gain {3} {4} icon until the end of the phase',
                        context.player,
                        this,
                        context.target,
                        icon === 'intrigue' ? 'an' : 'a',
                        icon
                    );
                });
            }
        });
    }
}

TheRiverroad.code = '27038';

export default TheRiverroad;
