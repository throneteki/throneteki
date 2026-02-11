import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SerHarryStrickland extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this
            },
            target: {
                cardCondition: {
                    location: 'play area',
                    type: 'character',
                    trait: 'Mercenary',
                    cardCondition: (card) =>
                        GameActions.standCard({ card }).allow() ||
                        GameActions.gainIcon({ card }).allow()
                }
            },
            handler: (context) => {
                this.game.promptForIcon(context.player, this, (icon) => {
                    this.game.resolveGameAction(
                        GameActions.simultaneously([
                            GameActions.standCard((context) => ({ card: context.target })),
                            GameActions.genericHandler((context) => {
                                this.untilEndOfPhase((ability) => ({
                                    match: context.target,
                                    effect: ability.effects.addIcon(icon)
                                }));
                            })
                        ]),
                        context
                    );

                    this.game.addMessage(
                        '{0} uses {1} to stand and give {2} {3} icon to {4} until the end of the phase',
                        this.controller,
                        this,
                        icon === 'intrigue' ? 'an' : 'a',
                        icon,
                        context.target
                    );
                });
            }
        });
    }
}

SerHarryStrickland.code = '26073';

export default SerHarryStrickland;
