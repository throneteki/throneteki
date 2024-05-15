import DrawCard from '../../drawcard.js';

class SerAmoryLorch extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.opponentHasThreeOrFewerChars(),
            match: this,
            effect: ability.effects.addKeyword('Renown')
        });
    }

    opponentHasThreeOrFewerChars() {
        let opponents = this.game.getOpponents(this.controller);
        return opponents.some((opponent) => {
            return opponent.getNumberOfCardsInPlay((card) => card.getType() === 'character') <= 3;
        });
    }
}

SerAmoryLorch.code = '04049';

export default SerAmoryLorch;
