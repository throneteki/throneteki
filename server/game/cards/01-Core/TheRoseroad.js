import DrawCard from '../../drawcard.js';

class TheRoseroad extends DrawCard {
    setupCardAbilities() {
        this.plotModifiers({
            gold: 1
        });
    }
}

TheRoseroad.code = '01040';

export default TheRoseroad;
