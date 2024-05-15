import DrawCard from '../../drawcard.js';

class EveryCaptainIsAKing extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Grant King trait',
            condition: () => this.getCaptains(this.controller).length > 0,
            message: {
                format: '{player} plays {source} to have {captains} gain the King trait',
                args: { captains: (context) => this.getCaptains(context.player) }
            },
            handler: (context) => {
                let captains = this.getCaptains(context.player);
                this.untilEndOfPhase((ability) => ({
                    match: captains,
                    effect: ability.effects.addTrait('King')
                }));
                this.untilEndOfPhase((ability) => ({
                    match: captains,
                    effect: ability.effects.doesNotKneelAsAttacker({ challengeType: 'power' })
                }));
            }
        });
    }

    getCaptains(player) {
        return player.filterCardsInPlay(
            (card) => card.getType() === 'character' && card.hasTrait('Captain')
        );
    }
}

EveryCaptainIsAKing.code = '14026';

export default EveryCaptainIsAKing;
