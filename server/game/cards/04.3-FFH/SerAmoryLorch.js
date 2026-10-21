import DrawCard from '../../drawcard.js';

class SerAmoryLorch extends DrawCard {
    // Ser Amory Lorch (04049)
    // While an opponent controls 3 or fewer characters, Ser Amory Lorch gains renown.
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
