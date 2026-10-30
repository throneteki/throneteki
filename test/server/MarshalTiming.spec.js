import { addSetupTest } from '../helpers/integrationhelper.js';

describe('marshaling while a reaction window is open', function () {
    for (const numOfPlayers of [1, 2]) {
        describe(`with ${numOfPlayers} player${numOfPlayers === 1 ? '' : 's'}`, function () {
            beforeEach(function () {
                addSetupTest(this, { numOfPlayers });
                this.setupTest({
                    phase: 'marshal',
                    player1: {
                        hand: ['Arya Stark (Core)', 'Tumblestone Knight'],
                        drawDeck: ['Hedge Knight']
                    }
                });
                this.player1.clickCard(this.aryaStark);
            });

            it('cannot marshal another card until the reaction window closes', function () {
                this.player1.clickCard(this.tumblestoneKnight);
                expect(this.tumblestoneKnight.location).toBe('hand');

                this.player1.triggerAbility(this.aryaStark);
                this.player1.clickCard(this.tumblestoneKnight);

                expect(this.tumblestoneKnight.location).toBe('play area');
                expect(this.player1).isReadyToTakeAction();
            });
        });
    }
});
