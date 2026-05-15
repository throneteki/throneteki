const PROMPT_AGENDA = 'Choose one for Pass Beneath the Shadow';
const PROMPT_GOLD = 'Gain 1 gold';
const PROMPT_CARD = 'Pay 1 gold to draw a card';
const PROMPT_STR = 'Give character +2 STR';

describe('Pass Beneath the Shadow', function () {
    integration(function () {
        beforeEach(function () {
            const deck = this.buildDeck('baratheon', [
                'Pass Beneath the Shadow',
                'Nefarious Acolyte',
                'Melisandre (Core)',
                'Loan from the Iron Bank'
            ]);
            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();

            this.passBeneathTheShadow = this.player1.findCardByName(
                'Pass Beneath the Shadow',
                'agenda'
            );
            this.nefariousAcolyte = this.player1.findCardByName('Nefarious Acolyte', 'hand');
            this.melisandre = this.player1.findCardByName('Melisandre', 'hand');

            this.player1.clickCard(this.nefariousAcolyte);
            this.player1.clickPrompt('Setup in shadows');

            this.completeSetup();
            this.selectFirstPlayer(this.player1);
        });

        describe('when triggered for the first time', function () {
            beforeEach(function () {
                this.player1.clickCard(this.nefariousAcolyte);
                this.player1.clickCard(this.passBeneathTheShadow);
            });

            it('should give the player all three options', function () {
                expect(this.player1).toHavePrompt(PROMPT_AGENDA);
                expect(this.player1).toHavePromptButton(PROMPT_GOLD);
                expect(this.player1).toHavePromptButton(PROMPT_CARD);
                expect(this.player1).toHavePromptButton(PROMPT_STR);
            });

            describe('and the player chooses to gain 1 gold', function () {
                beforeEach(function () {
                    this.goldBefore = this.player1Object.gold;
                    this.player1.clickPrompt(PROMPT_GOLD);
                });

                it('should give the player 1 gold', function () {
                    expect(this.player1Object.gold).toBe(this.goldBefore + 1);
                });

                describe('and triggered for the second time', function () {
                    beforeEach(function () {
                        this.player1.dragCard(this.nefariousAcolyte, 'shadows');
                        this.player1.clickCard(this.nefariousAcolyte);
                        this.player1.clickCard(this.passBeneathTheShadow);
                    });

                    it('should give the player two options', function () {
                        expect(this.player1).toHavePrompt(PROMPT_AGENDA);
                        expect(this.player1).toHaveDisabledPromptButton(PROMPT_GOLD);
                        expect(this.player1).toHavePromptButton(PROMPT_CARD);
                        expect(this.player1).toHavePromptButton(PROMPT_STR);
                    });

                    describe('and the player chooses to pay 1 gold to draw a card', function () {
                        beforeEach(function () {
                            this.player1.dragCard(this.melisandre, 'draw deck');
                            this.goldBefore = this.player1Object.gold;
                            this.player1.clickPrompt(PROMPT_CARD);
                        });

                        it("should reduce the player's gold by 1 and draw a card", function () {
                            expect(this.player1Object.gold).toBe(this.goldBefore - 1);
                            expect(this.melisandre.location).toBe('hand');
                        });

                        describe('and triggered for the third time', function () {
                            beforeEach(function () {
                                this.player1.dragCard(this.nefariousAcolyte, 'shadows');
                                this.player1.clickCard(this.nefariousAcolyte);
                                this.player1.clickCard(this.passBeneathTheShadow);
                            });

                            it('should give the player one option', function () {
                                expect(this.player1).toHavePrompt(PROMPT_AGENDA);
                                expect(this.player1).toHaveDisabledPromptButton(PROMPT_GOLD);
                                expect(this.player1).toHaveDisabledPromptButton(PROMPT_CARD);
                                expect(this.player1).toHavePromptButton(PROMPT_STR);
                            });

                            describe('and the player chooses to give a character +2 STR', function () {
                                beforeEach(function () {
                                    this.player1.clickPrompt(PROMPT_STR);
                                    this.strBefore = this.nefariousAcolyte.getStrength();
                                    this.player1.clickCard(this.nefariousAcolyte);
                                });

                                it('should give the selected character +2 STR until the end of the phase', function () {
                                    expect(this.nefariousAcolyte.getStrength()).toBe(
                                        this.strBefore + 2
                                    );
                                });

                                describe('and triggered again', function () {
                                    beforeEach(function () {
                                        this.player1.dragCard(this.nefariousAcolyte, 'shadows');
                                        this.player1.clickCard(this.nefariousAcolyte);
                                    });

                                    it('should give the player no options', function () {
                                        expect(this.player1).not.toAllowAbilityTrigger(
                                            this.passBeneathTheShadow
                                        );
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});
