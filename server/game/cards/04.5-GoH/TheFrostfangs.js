import DrawCard from '../../drawcard.js';

class TheFrostfangs extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this
            },
            chooseOpponent: true,
            handler: (context) => {
                this.game.addMessage(
                    '{0} uses {1} to give control of {1} to {2}',
                    this.controller,
                    this,
                    context.opponent
                );
                this.game.takeControl(context.opponent, this);
            }
        });
        this.plotModifiers({
            reserve: -1
        });
    }
}

TheFrostfangs.code = '04098';

export default TheFrostfangs;
