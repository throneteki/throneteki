import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ShaggaSonOfDolf extends DrawCard {
    // Shagga Son of Dolf (05009)
    // While Shagga Son of Dolf is in your hand, he gains ambush (0) if you control a Clansman
    // character or Tyrion Lannister.
    // Forced Reaction: After Shagga Son of Dolf enters play using ambush, choose and kill a
    // [lannister] character you control.
    setupCardAbilities() {
        this.action({
            title: 'Ambush(0)',
            location: 'hand',
            phase: 'challenge',
            condition: (context) => context.source.hasClansmanOrTyrion(),
            message: '{player} ambushes {source} into play for free',
            gameAction: GameActions.putIntoPlay((context) => ({
                player: context.player,
                card: context.source,
                playingType: 'ambush'
            }))
        });

        this.forcedReaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    event.card === context.source && event.playingType === 'ambush'
            },
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.controller === context.source.controller &&
                    card.isFaction('lannister') &&
                    card.getType() === 'character',
                gameAction: 'kill'
            },
            message: '{player} is forced by {source} to kill a character',
            gameAction: GameActions.kill((context) => ({ card: context.target }))
        });
    }

    hasClansmanOrTyrion() {
        let cards = this.controller.filterCardsInPlay((card) => {
            return (
                (card.hasTrait('Clansman') && card.getType() === 'character') ||
                card.name === 'Tyrion Lannister'
            );
        });

        return cards.length > 0;
    }
}

ShaggaSonOfDolf.code = '05009';

export default ShaggaSonOfDolf;
