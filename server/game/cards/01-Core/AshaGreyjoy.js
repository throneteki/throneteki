import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class AshaGreyjoy extends DrawCard {
    // Asha Greyjoy (01067)
    // Stealth.
    // Reaction: After you win an unopposed challenge in which Asha Greyjoy is participating, stand
    // her.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    context.source.controller === event.challenge.winner &&
                    context.source.isParticipating() &&
                    event.challenge.isUnopposed()
            },
            message: '{player} uses {source} to stand {source}',
            gameAction: GameActions.standCard((context) => ({ card: context.source }))
        });
    }
}

AshaGreyjoy.code = '01067';

export default AshaGreyjoy;
