import AllPlayerPrompt from '../allplayerprompt.js';
import { Flags } from '../../Constants/index.js';

class SelectPlotPrompt extends AllPlayerPrompt {
    constructor(game, firstPlayer = game.getFirstPlayer()) {
        super(game);
        this.firstPlayer = firstPlayer;
        const players = game.getPlayers();
        this.dependencies = new Map(
            players.map((player) => [
                player,
                new Set(players.filter((other) => other.mustShowPlotSelection.includes(player)))
            ])
        );
    }

    canChoose(player) {
        return [...this.dependencies.get(player)].every(
            (other) => other.selectedPlot || other.hasFlag(Flags.player.cannotRevealPlot)
        );
    }

    completionCondition(player) {
        if (player.hasFlag(Flags.player.cannotRevealPlot)) {
            return true;
        }
        if (!this.canChoose(player)) {
            return false;
        }
        if (player.mustRevealPlot) {
            player.selectedPlot = player.mustRevealPlot;
            player.clearSelectableCards();
        } else if (!player.selectedPlot) {
            const selectable = player.getSelectableCards();
            if (selectable.length === 1) {
                this.selectPlot(player, selectable[0]);
            }
        }
        return !!player.selectedPlot;
    }

    activeCondition(player) {
        return !this.completionCondition(player) && this.canChoose(player);
    }

    activePrompt() {
        return {
            menuTitle: 'Select a plot',
            buttons: [{ arg: 'plotselected', text: 'Done' }],
            selectCard: true
        };
    }

    waitingPrompt(player) {
        return {
            menuTitle:
                !player.selectedPlot && !this.canChoose(player)
                    ? 'Waiting to look at chosen plots'
                    : 'Waiting for opponent(s) to select plot'
        };
    }

    onCardClicked(player, card) {
        if (card.getType() !== 'plot') {
            return false;
        }
        if (this.activeCondition(player) && player.getSelectableCards().includes(card)) {
            this.game.selectPlot(player, card);
        }
        return true;
    }

    onMenuCommand(player, arg) {
        if (arg !== 'plotselected' || !this.activeCondition(player)) {
            return;
        }
        const plot = player.getSelectableCards().find((card) => card.selected);
        if (plot) {
            this.selectPlot(player, plot);
        }
    }

    selectPlot(player, plot) {
        player.selectedPlot = plot;
        player.clearSelectableCards();
        this.game.addMessage('{0} has selected a plot', player);
    }

    highlightSelectableCards(player) {
        const cards = this.game.allCards.filter(
            (card) =>
                card.getType() === 'plot' &&
                card.location === 'plot deck' &&
                card.controller === player &&
                !card.hasFlag(Flags.card.notConsideredToBeInPlotDeck)
        );
        player.selectCard = true;
        player.setSelectableCards(cards);
    }

    findCycle(players) {
        const visit = (player, path) => {
            const index = path.indexOf(player);
            if (index !== -1) {
                return path.slice(index);
            }
            for (const dependency of this.dependencies.get(player)) {
                if (players.includes(dependency)) {
                    const cycle = visit(dependency, [...path, player]);
                    if (cycle) {
                        return cycle;
                    }
                }
            }
            return undefined;
        };
        for (const player of players) {
            const cycle = visit(player, []);
            if (cycle) {
                return cycle;
            }
        }
        return undefined;
    }

    continue() {
        const pending = this.getPromptablePlayers().filter(
            (player) => !this.completionCondition(player)
        );
        for (const player of pending) {
            if (this.canChoose(player)) {
                this.highlightSelectableCards(player);
            } else {
                player.clearSelectableCards();
            }
        }
        if (pending.length && !pending.some((player) => this.canChoose(player))) {
            const cycle = this.findCycle(pending);
            if (cycle && !this.cyclePrompted) {
                this.cyclePrompted = true;
                this.game.promptWithMenu(
                    this.firstPlayer,
                    {
                        chooseFirst: (_player, name) => {
                            const chosen = cycle.find((player) => player.name === name);
                            if (!chosen) {
                                return false;
                            }
                            for (const other of cycle) {
                                this.dependencies.get(chosen).delete(other);
                            }
                            this.cyclePrompted = false;
                            return true;
                        }
                    },
                    {
                        activePrompt: {
                            menuTitle: 'Choose who selects a plot first',
                            buttons: cycle.map((player) => ({
                                text: player.name,
                                arg: player.name,
                                method: 'chooseFirst'
                            }))
                        },
                        waitingPromptTitle: 'Waiting for first player to order plot choices'
                    }
                );
            }
            return false;
        }
        return super.continue();
    }
}

export default SelectPlotPrompt;
