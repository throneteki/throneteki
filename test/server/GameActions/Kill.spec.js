const Kill = require('../../../server/game/GameActions/Kill');

describe('Kill', function() {
    beforeEach(function() {
        this.cardSpy = jasmine.createSpyObj('card', ['allowGameAction', 'getType', 'createSnapshot']);
        this.playerSpy = jasmine.createSpyObj('player', ['moveCard']);
        this.gameSpy = jasmine.createSpyObj('game', ['popAbilityContext', 'pushAbilityContext', 'resolveAbility', 'addMessage']);
        this.context = { game: this.gameSpy };
        this.props = { victims: { card: this.cardSpy, player: this.playerSpy }, context: this.context };
    });

    describe('allow()', function() {
        beforeEach(function() {
            this.cardSpy.getType.and.returnValue('character');
            this.cardSpy.location = 'play area';
            this.cardSpy.allowGameAction.and.returnValue(true);
        });

        describe('when the card is in play and not immune', function() {
            it('returns true', function() {
                expect(Kill.allow(this.props)).toBe(true);
            });
        });

        describe('when the card is not in play', function() {
            beforeEach(function() {
                this.cardSpy.location = 'hand';
            });

            it('returns false', function() {
                expect(Kill.allow(this.props)).toBe(false);
            });
        });

        describe('when the card is not a character', function() {
            beforeEach(function() {
                this.cardSpy.getType.and.returnValue('location');
            });

            it('returns false', function() {
                expect(Kill.allow(this.props)).toBe(false);
            });
        });

        describe('when the card is immune', function() {
            beforeEach(function() {
                this.cardSpy.allowGameAction.and.returnValue(false);
            });

            it('returns false', function() {
                expect(Kill.allow(this.props)).toBe(false);
            });
        });
    });

    describe('createEvent()', function() {
        beforeEach(function() {
            this.cardSpy.getType.and.returnValue('character');
            this.cardSpy.location = 'play area';
            this.cardSpy.allowGameAction.and.returnValue(true);

            const events = Kill.createEvent(this.props).getConcurrentEvents();
            this.killEvent = events.find(event => event.name === 'onCharacterKilled');
            this.leaveEvent = events.find(event => event.name === 'onCardLeftPlay');
        });

        it('creates a onCharacterKilled event', function() {
            expect(this.killEvent.name).toBe('onCharacterKilled');
            expect(this.killEvent.card).toBe(this.cardSpy);
            expect(this.killEvent.player).toBe(this.playerSpy);
            expect(this.killEvent.allowSave).toBe(true);
            expect(this.killEvent.isBurn).toBe(false);
            expect(this.killEvent.snapshotName).toBe('cardStateWhenKilled');
        });

        it('creates an onCardLeftPlay event', function() {
            expect(this.leaveEvent.name).toBe('onCardLeftPlay');
            expect(this.leaveEvent.card).toBe(this.cardSpy);
        });

        // This doesn't work anymore - a game step for prompting dead pile order is used in the middle
        // describe('the event handler', function() {
        //     beforeEach(function() {
        //         this.killEvent.executeHandler();
        //     });
        //
        //     it('moves the card to the dead pile', function() {
        //         const placeEvent = this.killEvent.attachedEvents[0];
        //         expect(placeEvent.name).toBe('onCardPlaced');
        //         expect(placeEvent.card).toBe(this.cardSpy);
        //         expect(placeEvent.location).toBe('dead pile');
        //     });
        // });
    });
});
