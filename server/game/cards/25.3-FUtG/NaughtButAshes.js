import DrawCard from '../../drawcard.js';

class NaughtButAshes extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Give character -X STR',
            target: {
                cardCondition: {
                    location: 'play area',
                    type: 'character',
                    participating: true,
                    hasAttachments: false
                }
            },
            message: {
                format: '{player} plays {source} to give {target} {amount} STR until the end of the phase',
                args: { amount: () => this.getAmount() }
            },
            handler: (context) => {
                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: ability.effects.modifyStrength(this.getAmount())
                }));
            }
        });
    }

    getAmount() {
        return this.game.getPlayers().reduce((acc, player) => acc + player.shadows.length, 0) * -1;
    }
}

NaughtButAshes.code = '25054';

export default NaughtButAshes;
