import GameAction from './GameAction.js';

const Factions = {
    stark: 'Stark',
    lannister: 'Lannister',
    thenightswatch: "The Night's Watch",
    tyrell: 'Tyrell',
    baratheon: 'Baratheon',
    targaryen: 'Targaryen',
    martell: 'Martell',
    greyjoy: 'Greyjoy'
};

class NameFaction extends GameAction {
    constructor({ count = 1 } = {}) {
        super('nameFaction');
        this.count = count;
    }

    createEvent(context) {
        return this.event('onFactionsNamed', { player: context.player }, (event) => {
            const selected = [];
            context.game.promptWithMenu(
                context.player,
                {
                    selectFaction: (_player, faction) => {
                        if (!Object.hasOwn(Factions, faction) || selected.includes(faction)) {
                            return false;
                        }
                        selected.push(faction);
                        if (selected.length < this.count) {
                            return false;
                        }
                        context.source.namedFactions = selected;
                        event.factions = selected;
                        context.game.addMessage(
                            '{0} names {1} for {2}',
                            context.player,
                            selected.map((name) => Factions[name]),
                            context.source
                        );
                        return true;
                    }
                },
                {
                    activePrompt: {
                        menuTitle:
                            this.count === 1 ? 'Name a faction' : `Name ${this.count} factions`,
                        buttons: Object.entries(Factions).map(([arg, text]) => ({
                            arg,
                            text,
                            method: 'selectFaction',
                            disabled: () => selected.includes(arg)
                        }))
                    },
                    source: context.source
                }
            );
        });
    }
}

export default NameFaction;
