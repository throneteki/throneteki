import AgendaCard from '../../agendacard.js';

class UnknownAndUnknowable extends AgendaCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onDecksPrepared']);
    }

    setupCardAbilities(ability) {
        this.action({
            title: 'Give a trait',
            cost: ability.costs.kneelFactionCard(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.controller === this.controller
            },
            handler: (context) => {
                this.context = context;

                this.game.promptWithMenu(context.player, this, {
                    activePrompt: {
                        menuTitle: 'Name a trait',
                        controls: [
                            { type: 'trait-name', command: 'menuButton', method: 'selectTraitName' }
                        ]
                    },
                    source: this
                });
            }
        });
    }

    selectTraitName(player, traitName) {
        this.untilEndOfPhase((ability) => ({
            match: this.context.target,
            effect: ability.effects.addTrait(traitName)
        }));

        this.game.addMessage(
            '{0} uses {1} to give {2} the {3} trait',
            player,
            this,
            this.context.target,
            traitName
        );

        return true;
    }

    onDecksPrepared() {
        let factionsInDecks = [];

        for (const card of this.game.allCards) {
            if (card.owner === this.owner && !factionsInDecks.includes(card.getPrintedFaction())) {
                factionsInDecks.push(card.getPrintedFaction());
            }
        }

        let factionsToAnnounce = factionsInDecks.filter(
            (faction) => faction !== this.controller.getFaction() && faction !== 'neutral'
        );
        let message = '{0} names {1} as their {2} for {3}';

        if (factionsToAnnounce.length > 2) {
            message += ' (this exceeds the maximum allowed number of factions)';
            this.game.addAlert(
                'danger',
                message,
                this.controller,
                factionsToAnnounce,
                'factions',
                this
            );
            return;
        }

        if (factionsToAnnounce.length === 0) {
            //Don't print any message: allows the player to bluff any faction
            return;
        }

        this.game.addMessage(
            message,
            this.controller,
            factionsToAnnounce,
            factionsToAnnounce.length > 1 ? 'factions' : 'faction',
            this
        );
    }
}

UnknownAndUnknowable.code = '00363';

export default UnknownAndUnknowable;
