import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class BeneathThePetals extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Give icon and insight',
            target: {
                cardCondition: {
                    type: 'character',
                    location: 'play area',
                    shadow: true
                }
            },
            message:
                '{player} plays {source} to give {target} insight and a challenge icon of their choice until the end of the phase',
            handler: (context) => {
                this.game.promptForIcon(context.player, this, (icon) => {
                    this.untilEndOfPhase((ability) => ({
                        match: context.target,
                        effect: [
                            ability.effects.addIcon(icon),
                            ability.effects.addKeyword('insight')
                        ]
                    }));
                    this.game.addMessage(
                        '{0} chooses to have {1} gain {2} {3} icon and insight until the end of the phase',
                        context.player,
                        context.target,
                        icon === 'intrigue' ? 'an' : 'a',
                        icon
                    );
                });
            }
        });
        this.interrupt({
            location: ['draw deck'],
            when: {
                onCardRevealed: (event) => event.card == this && event.card.location === 'draw deck'
            },
            message: '{player} places {source} in shadows and gains 1 gold',
            gameAction: GameActions.simultaneously([
                GameActions.placeCard({ card: this, location: 'shadows' }),
                GameActions.gainGold((context) => ({ player: context.player, amount: 1 }))
            ])
        });
    }
}

BeneathThePetals.code = '26036';

export default BeneathThePetals;
