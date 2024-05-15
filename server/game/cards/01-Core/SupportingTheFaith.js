import PlotCard from '../../plotcard.js';

class SupportingTheFaith extends PlotCard {
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                onPhaseStarted: (event) => event.phase === 'challenge'
            },
            handler: () => {
                for (let player of this.game.getPlayers()) {
                    this.game.returnGoldToTreasury({ player: player, amount: player.gold });
                }
                this.game.addMessage(
                    '{0} uses {1} to make each player return their gold to the treasury',
                    this.controller,
                    this
                );
            }
        });
    }
}

SupportingTheFaith.code = '01023';

export default SupportingTheFaith;
