import GameActions from '../../../server/game/GameActions/index.js';

describe('when a card leaves play', function () {
    function rootOf(event) {
        while (event.parent) {
            event = event.parent;
        }
        return event;
    }

    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [
                    {
                        card: 'Septa Mordane',
                        dupes: 1,
                        attachments: [
                            'Little Bird (Core)',
                            { card: 'Crown of Gold (TRtW)', owner: 'player2' }
                        ]
                    }
                ]
            },
            player2: { faction: 'targaryen' }
        });

        this.dupe = this.septaMordane.dupes[0];
        this.events = {};
        for (const name of ['onCardLeftPlay', 'onCardReturnedToHand', 'onCardDiscarded']) {
            this.game.on(name, (event) => {
                this.events[event.card.uuid] = this.events[event.card.uuid] || [];
                this.events[event.card.uuid].push(event);
            });
        }
        this.eventFor = (card, name) =>
            (this.events[card.uuid] || []).find((event) => event.name === name);
    });

    function itRemovesAttachmentsAndDuplicates() {
        it('returns attachments to hand, and discards terminal attachments and duplicates', function () {
            expect(this.septaMordane.location).toBe('discard pile');
            expect(this.littleBird.location).toBe('hand');
            expect(this.player1.player.hand).toContain(this.littleBird);
            expect(this.crownOfGold.location).toBe('discard pile');
            expect(this.player2.player.discardPile).toContain(this.crownOfGold);
            expect(this.dupe.location).toBe('discard pile');
        });

        it('removes them simultaneously with the card leaving play', function () {
            const root = rootOf(this.eventFor(this.septaMordane, 'onCardLeftPlay'));

            expect(rootOf(this.eventFor(this.littleBird, 'onCardReturnedToHand'))).toBe(root);
            expect(rootOf(this.eventFor(this.crownOfGold, 'onCardDiscarded'))).toBe(root);
            expect(rootOf(this.eventFor(this.dupe, 'onCardDiscarded'))).toBe(root);
        });

        it('does not let them be saved', function () {
            expect(this.eventFor(this.littleBird, 'onCardReturnedToHand').allowSave).toBe(false);
            expect(this.eventFor(this.crownOfGold, 'onCardDiscarded').allowSave).toBe(false);
            expect(this.eventFor(this.dupe, 'onCardDiscarded').allowSave).toBe(false);
        });
    }

    describe('through a game action', function () {
        beforeEach(function () {
            this.game.resolveGameAction(
                GameActions.discardCard({ card: this.septaMordane, allowSave: false })
            );
            this.game.continue();
        });

        itRemovesAttachmentsAndDuplicates();
    });

    describe('through the legacy moveCard', function () {
        beforeEach(function () {
            this.player1.player.moveCard(this.septaMordane, 'discard pile');
            this.game.continue();
        });

        itRemovesAttachmentsAndDuplicates();
    });
});
