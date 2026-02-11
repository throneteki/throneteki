import AgendaCard from '../../agendacard.js';
import GameActions from '../../GameActions/index.js';

class ArmedToTheTeeth extends AgendaCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onDecksPrepared']);
    }

    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) => event.challenge.winner === this.controller
            },
            cost: [
                ability.costs.kneelFactionCard(),
                ability.costs.payXGold(
                    () => Math.min(...this.attachmentCosts()),
                    () => Math.max(...this.attachmentCosts())
                )
            ],
            target: {
                type: 'select',
                activePromptTitle: 'Select an attachment',
                cardCondition: (card, context) =>
                    context.player.agenda.underneath.includes(card) &&
                    card.getType() === 'attachment' &&
                    card.hasPrintedCost() &&
                    (context.xValue === undefined || card.getPrintedCost() === context.xValue) &&
                    GameActions.putIntoPlay({ card }).allow()
            },
            message: {
                format: '{player} uses {source}, kneels their faction card and pays {xValue} gold to put {target} into play from underneath {source}',
                args: { xValue: (context) => context.xValue }
            },
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.putIntoPlay((context) => ({ card: context.target })),
                    context
                );
            }
        });
    }

    onDecksPrepared() {
        const context = {
            player: this.controller,
            game: this.game,
            source: this
        };
        this.game.resolveGameAction(
            GameActions.search({
                title: 'Select up to 5 attachments',
                match: {
                    type: 'attachment',
                    trait: 'Weapon',
                    condition: (card, context) =>
                        !context.selectedCards.some((sc) => sc.name === card.name)
                },
                reveal: true,
                numToSelect: 5,
                message: '{player} places {searchTarget} facedown under {source}',
                gameAction: GameActions.simultaneously((context) =>
                    context.searchTarget.map((card) =>
                        GameActions.placeCardUnderneath({
                            card,
                            parentCard: context.player.agenda,
                            facedown: false
                        })
                    )
                )
            }),
            context
        );
    }

    attachmentCosts() {
        const attachments = this.controller.agenda.underneath.filter(
            (card) => card.getType() === 'attachment' && card.hasPrintedCost()
        );
        return attachments.map((card) => card.getPrintedCost());
    }
}

ArmedToTheTeeth.code = '26120';

export default ArmedToTheTeeth;
