import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SmallCouncilChamber extends DrawCard {
    // Small Council Chamber (02110)
    // Immune to events.
    // Reaction: After you win an [intrigue] challenge, Small Council Chamber gains 1 power.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.immuneTo((card) => card.getType() === 'event')
        });
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    event.challenge.challengeType === 'intrigue' &&
                    context.source.allowGameAction('gainPower')
            },
            message: '{player} gains 1 power on {source}',
            gameAction: GameActions.gainPower((context) => ({ card: context.source, amount: 1 }))
        });
    }
}

SmallCouncilChamber.code = '02110';

export default SmallCouncilChamber;
