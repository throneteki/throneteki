import DrawCard from '../../drawcard.js';

class LannisportMoneylender extends DrawCard {
    // Lannisport Moneylender (01093)
    // Limited.
    // +1 Income.
    setupCardAbilities() {
        this.plotModifiers({
            gold: 1
        });
    }
}

LannisportMoneylender.code = '01093';

export default LannisportMoneylender;
