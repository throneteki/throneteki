import DrawCard from '../../drawcard.js';

class SerGregorClegane extends DrawCard {
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                afterChallenge: (event) =>
                    this.isParticipating() && event.challenge.isMatch({ winner: this.controller })
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.controller === this.controller,
                gameAction: 'kill'
            },
            message: '{player} is forced to choose and kill {target} for {source}',
            handler: (context) => {
                this.game.killCharacter(context.target);
            }
        });
    }
}

SerGregorClegane.code = '14027';

export default SerGregorClegane;
