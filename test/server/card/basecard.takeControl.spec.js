import BaseCard from '../../../server/game/basecard.js';

describe('BaseCard', function () {
    describe('takeControl()', function () {
        beforeEach(function () {
            this.owner = { owner: 1 };
            this.newController = { controller: 1 };
            this.source = { source: 1 };

            this.card = new BaseCard(this.owner, {});
        });

        describe('when taking sourced control', function () {
            beforeEach(function () {
                this.card.takeControl(this.newController, this.source);
            });

            it('should update the controller', function () {
                expect(this.card.controller).toBe(this.newController);
            });

            it('should handle losing control after another take control', function () {
                // Revert the earlier control
                this.card.takeControl(this.owner, { source: 2 });
                this.card.revertControl(this.source);

                expect(this.card.controller).toBe(this.owner);
            });
        });

        describe('when taking permanent control as the non-owner', function () {
            beforeEach(function () {
                this.card.takeControl(this.newController);
            });

            it('should update the controller', function () {
                expect(this.card.controller).toBe(this.newController);
            });

            it('should clear any other take control effects', function () {
                this.card.takeControl(this.newController, this.source);
                this.card.takeControl(this.newController);
                this.card.revertControl();

                expect(this.card.controller).toBe(this.owner);
            });
        });

        describe('when taking permanent control as the owner', function () {
            beforeEach(function () {
                this.card.takeControl(this.newController, this.source);
                this.card.takeControl(this.owner);
            });

            it('should update the controller', function () {
                expect(this.card.controller).toBe(this.owner);
            });

            it('should clear any other take control effects', function () {
                this.card.revertControl();

                expect(this.card.controller).toBe(this.owner);
            });
        });
    });
});
