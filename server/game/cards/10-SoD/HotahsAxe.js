import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class HotahsAxe extends DrawCard {
    // Hotah's Axe (10019)
    // Attached character gets +3 STR.
    // Reaction: After a [martell] character enters play during the challenges phase, put Hotah's
    // Axe into play from your hand, attached to that character.
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.modifyStrength(3)
        });

        this.reaction({
            when: {
                //Not seeing any value in being able to attach this to opponent's characters
                onCardEntersPlay: (event, context) =>
                    event.card.controller === context.player &&
                    event.card.isFaction('martell') &&
                    event.card.getType() === 'character' &&
                    event.card.location === 'play area' &&
                    context.game.currentPhase === 'challenge'
            },
            location: 'hand',
            message: {
                format: '{player} puts {source} into play and attaches it to {card}',
                args: { card: (context) => context.event.card }
            },
            gameAction: GameActions.attach((context) => ({
                player: context.player,
                attachment: context.source,
                target: context.event.card,
                playingType: 'play'
            }))
        });
    }
}

HotahsAxe.code = '10019';

export default HotahsAxe;
