const _ = require('underscore');

const AgendaCard = require('../../agendacard.js');
const RevealPlots = require('../../gamesteps/revealplots.js');

class TheRainsOfCastamere extends AgendaCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onDecksPrepared', 'onPlotDiscarded', 'onPlotsRecycled']);
    }

    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: event => (
                    !this.owner.faction.kneeled &&
                    event.challenge.challengeType === 'intrigue' &&
                    event.challenge.winner === this.owner &&
                    event.challenge.strengthDifference >= 5
                )
            },
            handler: this.trigger.bind(this)
        });

        this.action({
            title: 'Manually trigger',
            cost: ability.costs.kneelFactionCard(),
            handler: this.trigger.bind(this)
        });
    }

    trigger() {
        this.game.promptWithMenu(this.owner, this, {
            activePrompt: {
                menuTitle: 'Trigger Scheme plot?',
                buttons: this.menuButtons()
            },
            source: this
        });        
    }

    onDecksPrepared() {
        this.separateSchemePlots();
    }

    onPlotsRecycled(event) {
        if(event.player === this.controller) {
            this.separateSchemePlots();
        }
    }

    separateSchemePlots() {
        let schemePartition = this.owner.plotDeck.partition(card => card.hasTrait('Scheme'));
        let schemes = schemePartition[0];
        this.owner.plotDeck = _(schemePartition[1]);
        for(let scheme of schemes) {
            this.owner.moveCard(scheme, 'scheme plots');
        }
    }

    onPlotDiscarded(event) {
        if(event.card.controller === this.controller && event.card.hasTrait('Scheme')) {
            this.owner.moveCard(event.card, 'out of game');
        }
    }

    menuButtons() {
        let buttons = this.owner.schemePlots.map(scheme => {
            return { method: 'revealScheme', card: scheme };
        });

        buttons.push({ text: 'Done', method: 'cancelScheme' });
        return buttons;
    }

    revealScheme(player, schemeId) {
        let scheme = this.owner.schemePlots.find(card => card.uuid === schemeId);

        if(!scheme) {
            return false;
        }

        this.game.addMessage('{0} uses {1} to reveal {2}', player, this, scheme);

        this.schemes = _.reject(this.schemes, card => card === scheme);

        player.selectedPlot = scheme;
        player.removeActivePlot();
        player.flipPlotFaceup();
        this.game.queueStep(new RevealPlots(this.game, [scheme]));

        player.kneelCard(player.faction);

        return true;
    }

    cancelScheme() {
        return true;
    }
}

TheRainsOfCastamere.code = '05045';

module.exports = TheRainsOfCastamere;
