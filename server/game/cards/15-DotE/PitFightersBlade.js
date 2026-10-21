import DrawCard from '../../drawcard.js';

class PitFightersBlade extends DrawCard {
    // Pit Fighter's Blade (15021)
    // Attached character gains renown during [military] challenges.
    setupCardAbilities(ability) {
        this.whileAttached({
            condition: (context) => context.game.isDuringChallenge({ challengeType: 'military' }),
            effect: ability.effects.addKeyword('Renown')
        });
    }
}

PitFightersBlade.code = '15021';

export default PitFightersBlade;
