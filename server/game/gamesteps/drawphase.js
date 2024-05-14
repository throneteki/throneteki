import Phase from './phase.js';
import SimpleStep from './simplestep.js';
import ActionWindow from './actionwindow.js';
import GameActions from '../GameActions/index.js';

class DrawPhase extends Phase {
    constructor(game) {
        super(game, 'draw');
        this.initialise([
            new SimpleStep(game, () => this.draw()),
            new ActionWindow(this.game, 'After cards drawn', 'draw')
        ]);
    }

    draw() {
        const players = this.game.getPlayers();
        const actions = players.map((player) => this.createAction(player));

        this.game.resolveGameAction(GameActions.simultaneously(actions));
    }

    createAction(player) {
        return GameActions.drawCards({
            amount: player.drawPhaseCards,
            player,
            reason: 'drawPhase'
        }).thenExecute((event) => {
            this.game.addMessage('{0} draws {1} cards', event.player, event.amount);
        });
    }
}

export default DrawPhase;
