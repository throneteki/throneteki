import DrawCard from '../../drawcard.js';

class Ward extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                this.game.isDuringChallenge({ challengeType: 'intrigue' }) &&
                this.controller.anyCardsInPlay({ type: 'character', participating: true }),
            effect: ability.effects.contributeCharacterStrength(() => this.parent)
        });
    }
}

Ward.code = '27532';
Ward.version = '1.0.0';

export default Ward;
