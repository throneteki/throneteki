const _ = require('underscore');
const Player = require('../../../server/game/player.js');
const DrawCard = require('../../../server/game/drawcard.js');

describe('Player', function() {
    describe('getDuplicateInPlay', function() {
        beforeEach(function() {
            this.game = jasmine.createSpyObj('game', ['playerDecked', 'raiseEvent']);
            this.player = new Player('1', { username: 'Player 1', settings: {} }, true, this.game);
            this.player.initialise();

            this.dupeCard = new DrawCard(this.player, { code: '1', name: 'Test' });
            this.dupeCard.location = 'play area';

            this.game.allCards = _([this.dupeCard]);

            this.cardSpy = jasmine.createSpyObj('card', ['isUnique']);

            this.cardSpy.isUnique.and.returnValue(true);
        });

        describe('when the card is not unique', function() {
            beforeEach(function() {
                this.cardSpy.isUnique.and.returnValue(false);

                this.dupe = this.player.getDuplicateInPlay(this.cardSpy);
            });

            it('should return undefined', function() {
                expect(this.isDupe).toBeUndefined;
            });
        });

        describe('when the other copy is not in play', function() {
            beforeEach(function() {
                this.dupeCard.location = 'hand';

                this.dupe = this.player.getDuplicateInPlay(this.cardSpy);
            });

            it('should return undefined', function() {
                expect(this.isDupe).toBeUndefined;
            });
        });

        describe('when the other copy is not owned by the player', function() {
            beforeEach(function() {
                this.dupeCard.owner = {};

                this.dupe = this.player.getDuplicateInPlay(this.cardSpy);
            });

            it('should return undefined', function() {
                expect(this.isDupe).toBeUndefined;
            });
        });

        describe('when there is a matching card in play by code', function() {
            beforeEach(function() {
                this.cardSpy.code = '1';
                this.cardSpy.name = 'Other';

                this.dupe = this.player.getDuplicateInPlay(this.cardSpy);
            });

            it('should return dupe', function() {
                expect(this.dupe).toBe(this.dupeCard);
            });
        });

        describe('when there is a matching card in play by name', function() {
            beforeEach(function() {
                this.cardSpy.code = '2';
                this.cardSpy.name = 'Test';

                this.dupe = this.player.getDuplicateInPlay(this.cardSpy);
            });

            it('should return dupe', function() {
                expect(this.dupe).toBe(this.dupeCard);
            });
        });

        describe('when there is a matching attached card in play', function() {
            beforeEach(function() {
                this.attachedCard = new DrawCard(this.player, { code: '3', name: 'Attached', type_code: 'attachment' });
                this.attachedCard.location = 'play area';
                this.game.allCards.push(this.attachedCard);
                this.dupeCard.attachments.push(this.attachedCard);

                this.cardSpy.code = '3';
                this.cardSpy.name = 'Attached';

                this.dupe = this.player.getDuplicateInPlay(this.cardSpy);
            });

            it('should return the duplicate attached card', function() {
                expect(this.dupe).toBe(this.attachedCard);
            });
        });

        describe('when there is a card that doesnt match by name or code', function() {
            beforeEach(function() {
                this.cardSpy.code = '6';
                this.cardSpy.name = 'Other';

                this.dupe = this.player.getDuplicateInPlay(this.cardSpy);
            });

            it('should return undefined', function() {
                expect(this.dupe).toBe(undefined);
            });
        });
    });
});
