import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Fury extends DrawCard {
    // Fury (12026)
    // While you control Stannis Baratheon, he gains intimidate.
    // Reaction: After you win a [power] challenge, kneel Fury to choose a character or location.
    // Move 1 power from that card to your faction card.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.name === 'Stannis Baratheon',
            effect: ability.effects.addKeyword('Intimidate')
        });

        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.isMatch({
                        winner: context.source.controller,
                        challengeType: 'power'
                    })
            },
            cost: ability.costs.kneelSelf(),
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    ['character', 'location'].includes(card.getType()) &&
                    card.power > 0
            },
            message: '{player} kneels {source} to move 1 power from {target} to their faction card',
            gameAction: GameActions.movePower((context) => ({
                from: context.target,
                to: context.player.faction,
                amount: 1
            }))
        });
    }
}

Fury.code = '12026';

export default Fury;
