import DrawCard from '../../drawcard.js';

class PublicExecution extends DrawCard {
    setupCardAbilities() {
        this.action({
            phase: 'marshal',
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'character' && card.kneeled,
                gameAction: 'kill'
            },
            message: '{player} plays {source} to kill {target}',
            handler: (context) => {
                this.game.killCharacter(context.target);
            }
        });
    }
}

PublicExecution.code = '13068';

export default PublicExecution;
