import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/index.js';

class NightfortRuins extends DrawCard {
    setupCardAbilities(ability) {
        this.plotModifiers({
            reserve: 1
        });

        this.persistentEffect({
            condition: () =>
                this.game.isDuringChallenge({ challengeType: 'power' }) &&
                this.controller.anyCardsInPlay(
                    (card) => card.isParticipating() && card.getType() === 'character'
                ),
            effect: ability.effects.dynamicContributeStrength(() => this.getGoldAmount(), this)
        });
    }

    getGoldAmount() {
        return this.hasToken(Tokens.gold) ? this.tokens[Tokens.gold] : 0;
    }
}

NightfortRuins.code = '00123';

export default NightfortRuins;
