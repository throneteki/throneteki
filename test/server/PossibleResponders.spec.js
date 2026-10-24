import PossibleResponders from '../../server/game/PossibleResponders.js';
import { deckBuilder } from '../helpers/cards.js';

describe('PossibleResponders', function () {
    function cardData(...names) {
        return names.map((name) => deckBuilder.getCard(name));
    }

    function setup(context, player2Hand, player2Faction = 'stark') {
        context.setupTest({
            phase: 'challenge',
            player1: { faction: 'lannister', hand: ['Hear Me Roar!', 'Lannisport Merchant'] },
            player2: { faction: player2Faction, gold: 5, hand: player2Hand }
        });

        context.windows = [];
        context.game.on('onCardAbilityInitiated:cancelinterrupt', (event) =>
            context.windows.push(event)
        );
    }

    function playRoar(context) {
        context.player1.clickCard(context.hearMeRoar);
        context.player1.clickCard(context.lannisportMerchant);
    }

    describe('with a pool containing a cancel', function () {
        beforeEach(function () {
            setup(this, []);
            this.responders = new PossibleResponders(this.game, {
                cardData: cardData("The Hand's Judgment", 'Hear Me Roar!')
            });
            playRoar(this);
        });

        it('says the opponent could cancel the event, though their hand is empty', function () {
            expect(this.windows).toHaveLength(1);
            expect(
                this.responders.couldRespond(
                    this.player2.player,
                    'cancelinterrupt',
                    this.windows[0]
                )
            ).toBe(true);
        });

        it("does not say the event's own player could cancel it", function () {
            expect(
                this.responders.couldRespond(
                    this.player1.player,
                    'cancelinterrupt',
                    this.windows[0]
                )
            ).toBe(false);
        });

        it('only answers for the window type the ability uses', function () {
            expect(
                this.responders.couldRespond(this.player2.player, 'reaction', this.windows[0])
            ).toBe(false);
        });
    });

    describe('with a loyal cancel from another faction', function () {
        beforeEach(function () {
            setup(this, []);
            this.responders = new PossibleResponders(this.game, {
                cardData: cardData('08116')
            });
            playRoar(this);
        });

        it('says a player who cannot include it could not respond', function () {
            expect(
                this.responders.couldRespond(
                    this.player2.player,
                    'cancelinterrupt',
                    this.windows[0]
                )
            ).toBe(false);
        });
    });

    describe('with a loyal cancel from their own faction', function () {
        beforeEach(function () {
            setup(this, [], 'martell');
            this.responders = new PossibleResponders(this.game, {
                cardData: cardData('08116')
            });
            playRoar(this);
        });

        it('says the player could respond', function () {
            expect(
                this.responders.couldRespond(
                    this.player2.player,
                    'cancelinterrupt',
                    this.windows[0]
                )
            ).toBe(true);
        });
    });

    describe('for every faction', function () {
        beforeEach(function () {
            setup(this, []);
            playRoar(this);
        });

        it('builds and checks every candidate without errors', function () {
            const errors = [];
            const factions = [
                'baratheon',
                'greyjoy',
                'lannister',
                'martell',
                'thenightswatch',
                'stark',
                'targaryen',
                'tyrell'
            ];

            for (const faction of factions) {
                this.player2.player.faction.cardData.code = faction;
                const responders = new PossibleResponders(this.game, {
                    cardData: deckBuilder.cards
                });
                for (const abilityType of ['cancelinterrupt', 'interrupt', 'reaction']) {
                    responders.couldRespond(this.player2.player, abilityType, this.windows[0]);
                }
                for (const candidates of responders.getCandidates(this.player2.player).values()) {
                    for (const candidate of candidates) {
                        responders.safelyCouldTrigger(
                            candidate,
                            this.player2.player,
                            this.windows[0]
                        );
                    }
                }
                errors.push(
                    ...responders.errors.map(
                        ({ code, error }) => `${faction} ${code}: ${error.message}`
                    )
                );
            }

            expect(errors).toEqual([]);
        });
    });

    describe('with the full card pool', function () {
        beforeEach(function () {
            setup(this, ["The Hand's Judgment"]);
            this.listenersBefore = this.game
                .eventNames()
                .map((name) => [name, this.game.listenerCount(name)]);
            this.cardsBefore = this.game.allCards.length;
            this.responders = new PossibleResponders(this.game, { cardData: deckBuilder.cards });
            this.responders.getCandidates(this.player2.player);
        });

        it('builds phantoms that are not part of the game and listen for nothing', function () {
            expect(this.game.allCards.length).toBe(this.cardsBefore);
            expect(
                this.game.eventNames().map((name) => [name, this.game.listenerCount(name)])
            ).toEqual(this.listenersBefore);
            expect(Object.hasOwn(this.player2.player, 'registerAbilityMax')).toBe(false);
            expect(this.player2.player.game).toBe(this.game);
        });

        it("gives the same answer whatever is in the player's hand", function () {
            playRoar(this);
            const withCancel = this.responders.couldRespond(
                this.player2.player,
                'cancelinterrupt',
                this.windows[0]
            );

            this.player2.player.hand.splice(0);
            const withoutCancel = this.responders.couldRespond(
                this.player2.player,
                'cancelinterrupt',
                this.windows[0]
            );

            expect(withCancel).toBe(true);
            expect(withoutCancel).toBe(withCancel);
        });
    });
});
