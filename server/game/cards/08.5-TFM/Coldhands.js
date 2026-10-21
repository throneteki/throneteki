import DrawCard from '../../drawcard.js';

class Coldhands extends DrawCard {
    // Coldhands (08085)
    // Coldhands cannot be saved.
    // Reaction: After you marshal Coldhands, choose 1 other non-Army character controlled by each
    // player. Remove each of those characters from the game until Coldhands leaves play.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.cannotBeSaved()
        });

        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this && event.playingType === 'marshal'
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    !card.hasTrait('Army') &&
                    card !== this,
                mode: 'eachPlayer'
            },
            handler: (context) => {
                this.lastingEffect((ability) => ({
                    until: {
                        onCardLeftPlay: (event) => event.card === this
                    },
                    targetController: 'any',
                    match: context.target,
                    targetLocation: ['play area', 'out of game'],
                    effect: ability.effects.removeFromGame()
                }));

                this.game.addMessage(
                    '{0} uses {1} to remove {2} from the game until {1} leaves play',
                    context.player,
                    this,
                    context.target
                );
            }
        });
    }
}

Coldhands.code = '08085';

export default Coldhands;
