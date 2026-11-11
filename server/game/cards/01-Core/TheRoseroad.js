import DrawCard from '../../drawcard.js';

class TheRoseroad extends DrawCard {
    // The Roseroad (01040)
    // Limited.
    // +1 Income.
    setupCardAbilities() {
        this.plotModifiers({
            gold: 1
        });
    }
}

TheRoseroad.code = '01040';

export default TheRoseroad;
