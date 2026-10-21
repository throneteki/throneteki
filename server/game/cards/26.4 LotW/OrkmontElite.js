import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class OrkmontElite extends DrawCard {
    // Orkmont Elite (26063)
    // Assault. Pillage.
    // While Orkmont Elite has an attachment, it gains renown.
    // Reaction: After Orkmont Elite discards a card using pillage, put an attachment from the
    // losing opponent's discard pile into play under your control, attached to a character you
    // control.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.source.attachments.length >= 1,
            match: this,
            effect: ability.effects.addKeyword('Renown')
        });
        this.reaction({
            when: {
                onCardDiscarded: (event, context) =>
                    event.isPillage && event.source === context.source
            },
            target: {
                activePromptTitle: 'Select an attachment',
                cardCondition: (card, context) => context.source.cardCondition(card, context)
            },
            message: {
                format: "{player} uses {source} to put {target} into play from {opponent}'s discard pile",
                args: { opponent: (context) => context.game.currentChallenge.loser }
            },
            gameAction: GameActions.putIntoPlay((context) => ({
                player: context.player,
                card: context.target,
                attachmentTargets: (card) => card.controller === context.player
            }))
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
                attachmentTargets: (card) =>
                    card.controller === context.player && card.getType() === 'character'
            }).allow()
        );
    }
}

OrkmontElite.code = '26063';

export default OrkmontElite;
