import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class OrkmontElite extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.attachments.length >= 1,
            match: this,
            effect: ability.effects.addKeyword('Renown')
        });
        this.reaction({
            when: {
                onCardDiscarded: (event) => event.isPillage && event.source === this
            },
            target: {
                activePromptTitle: 'Select an attachment',
                cardCondition: (card, context) => this.cardCondition(card, context)
            },
            message: {
                format: "{player} uses {source} to put {target} into play from {opponent}'s discard pile",
                args: { opponent: () => this.game.currentChallenge.loser }
            },
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.putIntoPlay((context) => ({
                        player: context.player,
                        card: context.target,
                        attachmentTargets: (card) => card.controller === context.player
                    })),
                    context
                );
            }
        });
    }

    cardCondition(card, context) {
        return (
            card.controller === this.game.currentChallenge.loser &&
            card.getType() === 'attachment' &&
            card.location === 'discard pile' &&
            GameActions.putIntoPlay({
                player: context.player,
                card,
                attachmentTargets: (card) => card.controller === context.player
            }).allow()
        );
    }
}

OrkmontElite.code = '26063';

export default OrkmontElite;
