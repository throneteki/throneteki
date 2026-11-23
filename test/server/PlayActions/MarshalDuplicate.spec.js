import { Tokens } from '../../../server/game/Constants/index.js';

describe('marshaling a duplicate', function () {
    function duplicateMessages(game) {
        return game.gameChat.messages.filter((message) =>
            JSON.stringify(message.message).includes('duplicates')
        );
    }

    describe('when a restriction on printed characteristics applies', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    plot: 'Kingswood Ambush',
                    inPlay: ['Arya Stark (Core)'],
                    hand: ['Arya Stark (Core)']
                }
            });
            this.aryaInPlay = this.player1.findCardByName('Arya Stark', 'play area');
            this.aryaInHand = this.player1.findCardByName('Arya Stark', 'hand');
        });

        it('is not stopped, because a duplicate has no printed characteristics', function () {
            this.player1.clickCard(this.aryaInHand);

            expect(this.aryaInHand.location).toBe('duplicate');
            expect(this.aryaInPlay.dupes).toContain(this.aryaInHand);
            expect(duplicateMessages(this.game)).toHaveLength(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when the card cannot be marshaled by title', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: { inPlay: [{ card: 'Varys (TTS)', tokens: { [Tokens.gold]: 1 } }] },
                player2: { inPlay: ['Arya Stark (Core)'], hand: ['Arya Stark (Core)'] }
            });
            this.aryaInHand = this.player2.findCardByName('Arya Stark', 'hand');
            this.player1.clickMenu(this.varys, 'Name a card');
            this.player1.nameCard('Arya Stark');
            this.player1.clickPrompt('Done');
        });

        it('is not offered, and nothing is logged', function () {
            this.player2.clickCard(this.aryaInHand);

            expect(this.aryaInHand.location).toBe('hand');
            expect(duplicateMessages(this.game)).toHaveLength(0);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
