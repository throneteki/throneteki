import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/index.js';

class HornHill extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give participating characters +STR',
            phase: 'challenge',
            condition: () => this.game.currentChallenge && this.hasToken(Tokens.gold),
            cost: ability.costs.kneelSelf(),
            handler: (context) => {
                let challenge = this.game.currentChallenge;
                let cards = challenge.attackers
                    .concat(challenge.defenders)
                    .filter(
                        (card) => card.controller === this.controller && card.isFaction('tyrell')
                    );

                this.untilEndOfChallenge((ability) => ({
                    match: cards,
                    effect: ability.effects.modifyStrength(this.tokens[Tokens.gold])
                }));

                this.game.addMessage(
                    '{0} kneels {1} to give {2} +{3} STR until the end of the challenge',
                    context.player,
                    this,
                    cards,
                    this.tokens[Tokens.gold]
                );
            }
        });
    }
}

HornHill.code = '06104';

export default HornHill;
