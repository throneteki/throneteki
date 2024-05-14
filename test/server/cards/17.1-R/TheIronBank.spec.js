import { Tokens } from '../../../../server/game/Constants/index.js';

describe('The Iron Bank', function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('lannister', [
                'A Noble Cause',
                'The Iron Bank (R)',
                'Cersei Lannister (LoCR)',
                'Stone Crows',
                'Janos Slynt (AtSK)',
                'Red Cloaks',
                'Nightmares',
                "The Hand's Judgment"
            ]);
            const deck2 = this.buildDeck('thenightswatch', [
                'A Noble Cause',
                'A Meager Contribution',
                'Steward at the Wall',
                'Nightmares'
            ]);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();

            this.ironBank = this.player1.findCardByName('The Iron Bank');
            this.opponentChar = this.player2.findCardByName('Steward at the Wall', 'hand');

            this.player1.clickCard(this.ironBank);
            this.player2.clickCard(this.opponentChar);

            this.completeSetup();

            this.ironBank.modifyToken(Tokens.gold, 10);
        });

        describe('when the player collects income', function () {
            it('should double the gold on the Iron Bank', function () {
                this.selectFirstPlayer(this.player1);
                this.player1.triggerAbility('The Iron Bank');

                expect(this.ironBank.gold).toBe(15);
            });

            it('should not prompt when there is no gold on the Iron Bank', function () {
                delete this.ironBank.tokens.gold;
                this.selectFirstPlayer(this.player1);

                expect(this.player1).not.toAllowAbilityTrigger('The Iron Bank');
            });
        });

        describe('when the player has gold in their gold pool', function () {
            beforeEach(function () {
                this.selectFirstPlayer(this.player1);

                // Pass on Iron Bank
                this.player1.clickPrompt('Pass');
            });

            it('should not allow gold to be stolen from the card', function () {
                this.player2.triggerAbility('A Meager Contribution');
                // Pass on Hand's Judgment
                this.player1.clickPrompt('Pass');

                expect(this.ironBank.gold).toBe(10);
                expect(this.player1Object.gold).toBe(4);
                expect(this.player2Object.gold).toBe(1);
            });

            describe('', function () {
                beforeEach(function () {
                    // Pass on A Meager Contribution
                    this.player2.clickPrompt('Pass');
                });

                it('should allow cards to be marshalled', function () {
                    this.player1.clickCard('Cersei Lannister', 'hand');
                    this.player1.clickPrompt('2');

                    expect(this.ironBank.gold).toBe(8);
                    expect(this.player1Object.gold).toBe(2);
                });

                it('should allow events to be played', function () {
                    this.player1.clickCard('Nightmares', 'hand');
                    this.player1.clickPrompt('1');
                    this.player1.clickCard(this.opponentChar);

                    expect(this.opponentChar.isAnyBlank()).toBe(true);
                    expect(this.ironBank.gold).toBe(9);
                    expect(this.player1Object.gold).toBe(5);
                });

                it('should allow gold to be bestowed', function () {
                    let stoneCrows = this.player1.findCardByName('Stone Crows', 'hand');

                    this.player1.clickCard(stoneCrows);
                    // No gold from Iron Bank to marshal Stone Crows
                    this.player1.clickPrompt('0');
                    // Bestow 2 gold on Stone Crows
                    this.player1.clickPrompt('2');
                    // Choose the amount to use from the Iron Bank
                    this.player1.clickPrompt('2');

                    expect(stoneCrows.gold).toBe(2);
                    expect(this.ironBank.gold).toBe(8); // 10 - 2 from Bestow
                    expect(this.player1Object.gold).toBe(2); // 5 - 3 from marshal
                });

                it('should allow gold to be bestowed solely from Iron Bank', function () {
                    let stoneCrows = this.player1.findCardByName('Stone Crows', 'hand');

                    this.player1Object.gold = 3;

                    this.player1.clickCard(stoneCrows);
                    // No gold from Iron Bank to marshal Stone Crows
                    this.player1.clickPrompt('0');
                    // Bestow 2 gold on Stone Crows
                    this.player1.clickPrompt('2');

                    // Automatically spend from Iron Bank without prompting
                    expect(this.player1).not.toHavePromptButton('2');

                    expect(stoneCrows.gold).toBe(2);
                    expect(this.ironBank.gold).toBe(8); // 10 - 2 from Bestow
                    expect(this.player1Object.gold).toBe(0); // 3 - 3 from marshal
                });

                it('should allow gold to be moved', function () {
                    let redCloaks = this.player1.findCardByName('Red Cloaks', 'hand');
                    this.player1.clickCard(redCloaks);
                    // No gold from Iron Bank to marshal Red Cloaks
                    this.player1.clickPrompt('0');

                    this.player1.clickMenu(
                        redCloaks,
                        'Move 1 gold from your gold pool to this card'
                    );
                    // Move 1 gold from Iron Bank onto Red Cloaks
                    this.player1.clickPrompt('1');

                    expect(redCloaks.gold).toBe(1);
                    expect(this.ironBank.gold).toBe(9);
                    expect(this.player1Object.gold).toBe(3);
                });

                it('should allow gold to be paid for abilities', function () {
                    let janos = this.player1.findCardByName('Janos Slynt', 'hand');
                    this.player1.clickCard(janos);
                    // No gold from Iron Bank to marshal Janos Slynt
                    this.player1.clickPrompt('0');

                    this.player1.clickMenu(janos, 'Pay 1 gold to give Janos Slynt +2 strength');
                    // Automatically take it off the Iron Bank without prompting
                    // since 0 gold left in the actual pool
                    expect(this.player1).not.toHavePromptButton('1');

                    expect(janos.getStrength()).toBe(4);
                    expect(this.ironBank.gold).toBe(9);
                    expect(this.player1Object.gold).toBe(0);
                });
            });
        });

        describe('when the player has no gold in their gold pool', function () {
            beforeEach(function () {
                this.selectFirstPlayer(this.player2);
            });

            it('should allow actions to be paid for using gold on the Iron Bank', function () {
                this.player1.clickCard('Nightmares', 'hand');
                this.player1.clickCard(this.opponentChar);

                // Automatically take it off the Iron Bank without prompting
                expect(this.player1).not.toHavePromptButton('1');

                expect(this.opponentChar.isAnyBlank()).toBe(true);
                expect(this.ironBank.gold).toBe(9);
                expect(this.player1Object.gold).toBe(0);
            });

            it('should allow them to play interrupts / reactions using gold on the Iron Bank', function () {
                let cersei = this.player1.findCardByName('Cersei Lannister', 'hand');
                this.player1.dragCard(cersei, 'play area');
                this.player2.clickCard('Nightmares', 'hand');
                this.player2.clickCard(cersei);

                expect(this.player1).toAllowAbilityTrigger("The Hand's Judgment");
                expect(cersei.isAnyBlank()).toBe(false);

                this.player1.triggerAbility("The Hand's Judgment");

                // Automatically take it off the Iron Bank without prompting
                expect(this.player1).not.toHavePromptButton('1');

                expect(cersei.isAnyBlank()).toBe(false);
                expect(this.ironBank.gold).toBe(9);
                expect(this.player1Object.gold).toBe(0);
            });
        });
    });
});
