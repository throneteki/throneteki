describe('clicking a card with an action', function () {
    describe('when the card has one usable action', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: ['Gates of Winterfell'],
                    drawDeck: ['Winterfell Steward']
                }
            });
        });

        describe('and the player clicks it', function () {
            beforeEach(function () {
                this.game.cardClicked(this.player1.name, this.gatesOfWinterfell.uuid);
                this.game.continue();
            });

            it('asks for confirmation before using it', function () {
                expect(this.player1).toHavePrompt('Use Gates of Winterfell?');
                expect(this.player1).toHavePromptButton('Reveal top card of deck');
                expect(this.player1).toHavePromptButton('Cancel');
                expect(this.gatesOfWinterfell.kneeled).toBe(false);
                expect(this.winterfellSteward.location).toBe('draw deck');
            });

            it('uses the action once confirmed', function () {
                this.player1.clickPrompt('Reveal top card of deck');

                expect(this.gatesOfWinterfell.kneeled).toBe(true);
                expect(this.winterfellSteward.location).toBe('hand');
                expect(this.player1).isReadyToTakeAction();
            });

            it('can be cancelled', function () {
                this.player1.clickPrompt('Cancel');

                expect(this.gatesOfWinterfell.kneeled).toBe(false);
                expect(this.winterfellSteward.location).toBe('draw deck');
                expect(this.player1).isReadyToTakeAction();
            });
        });
    });

    describe('when the card is a cost reducer', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    inPlay: ['The Kingsroad']
                }
            });

            this.game.cardClicked(this.player1.name, this.theKingsroad.uuid);
            this.game.continue();
        });

        it('uses it without asking', function () {
            expect(this.theKingsroad.location).toBe('discard pile');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when the card has more than one usable action', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: ['Highgarden (BtB)', 'Paxter Redwyne (Core)'],
                    hand: ['Garden Caretaker']
                }
            });

            this.player1.clickCard(this.highgarden);
        });

        it('asks which action to use', function () {
            expect(this.player1).toHavePrompt('Choose an action');
            expect(this.player1).toHavePromptButton('Give characters +STR');
            expect(this.player1).toHavePromptButton('Return character to hand');
        });

        it('uses the chosen action', function () {
            this.player1.clickPrompt('Return character to hand');
            this.player1.clickCard(this.paxterRedwyne);

            expect(this.paxterRedwyne.location).toBe('hand');
            expect(this.player1).isReadyToTakeAction();
        });

        it('can be cancelled', function () {
            this.player1.clickPrompt('Cancel');

            expect(this.highgarden.kneeled).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('while manual mode is on', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                gameOptions: { manualMode: true },
                player1: {
                    inPlay: ['Gates of Winterfell'],
                    drawDeck: ['Winterfell Steward']
                }
            });

            this.game.cardClicked(this.player1.name, this.gatesOfWinterfell.uuid);
            this.game.continue();
        });

        it('offers the action alongside kneeling the card', function () {
            expect(this.player1).toHavePrompt('Choose an action');
            expect(this.player1).toHavePromptButton('Reveal top card of deck');
            expect(this.player1).toHavePromptButton('Kneel');
            expect(this.player1).toHavePromptButton('Cancel');
        });

        it('uses the action when chosen', function () {
            this.player1.clickPrompt('Reveal top card of deck');

            expect(this.gatesOfWinterfell.kneeled).toBe(true);
            expect(this.winterfellSteward.location).toBe('hand');
        });

        it('kneels the card without using the action when chosen', function () {
            this.player1.clickPrompt('Kneel');

            expect(this.gatesOfWinterfell.kneeled).toBe(true);
            expect(this.winterfellSteward.location).toBe('draw deck');
        });
    });
});

describe('the confirmation for an action that chooses targets', function () {
    describe('when the targets are in play', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: { inPlay: ['Grey Ghost', 'Hedge Knight'] },
                player2: { inPlay: ['Castle Guard', 'The Kingsroad'] }
            });

            this.game.cardClicked(this.player1.name, this.greyGhost.uuid);
            this.game.continue();
        });

        it('shows the cards the action could choose before its costs are paid', function () {
            expect(this.player1).toHavePrompt('Use Grey Ghost?');
            expect(this.greyGhost.kneeled).toBe(false);
            expect(this.player1).toBeAbleToSelect(this.hedgeKnight);
            expect(this.player1).toBeAbleToSelect(this.castleGuard);
            expect(this.player1).not.toBeAbleToSelect(this.greyGhost);
            expect(this.player1).not.toBeAbleToSelect(this.theKingsroad);
        });

        it('does not show them to the opponent', function () {
            expect(this.player2.player.getSelectableCards()).toHaveLength(0);
        });

        it('stops showing them when the action is cancelled', function () {
            this.player1.clickPrompt('Cancel');

            expect(this.player1.player.getSelectableCards()).toHaveLength(0);
            expect(this.greyGhost.kneeled).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });

        it('chooses from the same cards once the action is used', function () {
            this.player1.clickPrompt('Prevent character(s) from defending');

            expect(this.greyGhost.kneeled).toBe(true);
            expect(this.player1).toBeAbleToSelect(this.hedgeKnight);
            expect(this.player1).toBeAbleToSelect(this.castleGuard);
            expect(this.player1).not.toBeAbleToSelect(this.theKingsroad);

            this.player1.clickCard(this.castleGuard);
            this.player1.clickPrompt('Done');

            expect(this.player1.player.getSelectableCards()).toHaveLength(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when the targets are in your hand', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: ['Arianne Martell (Core)'],
                    hand: ['Hedge Knight', 'Ser Gregor Clegane (TKP)']
                },
                player2: { hand: ['Castle Guard'] }
            });

            this.game.cardClicked(this.player1.name, this.arianneMartell.uuid);
            this.game.continue();
        });

        it('shows the cards in your hand it could choose', function () {
            expect(this.player1).toHavePrompt('Use Arianne Martell?');
            expect(this.player1).toBeAbleToSelect(this.hedgeKnight);
            expect(this.player1).not.toBeAbleToSelect(this.serGregorClegane);
            expect(this.player1).not.toBeAbleToSelect(this.castleGuard);
            expect(this.player2.player.getSelectableCards()).toHaveLength(0);
        });
    });
});

describe('the confirmation for an action whose targets depend on the card using it', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Arianne Martell (JtO)'] },
            player2: { inPlay: ['Castle Guard', 'Ser Gregor Clegane (TKP)'] }
        });

        this.game.cardClicked(this.player1.name, this.arianneMartell.uuid);
        this.game.continue();
    });

    it('shows the cards it could choose as it is now', function () {
        expect(this.player1).toHavePrompt('Use Arianne Martell?');
        expect(this.player1).toBeAbleToSelect(this.castleGuard);
        expect(this.player1).not.toBeAbleToSelect(this.serGregorClegane);
        expect(this.player1).not.toBeAbleToSelect(this.arianneMartell);
    });
});

describe('the confirmation for an action whose cost moves the card using it', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [
                    { card: 'Painted Dogs', kneeling: true },
                    { card: 'Burned Men', kneeling: true }
                ]
            }
        });

        this.game.cardClicked(this.player1.name, this.paintedDogs.uuid);
        this.game.continue();
    });

    it('does not show the card itself as a target', function () {
        expect(this.player1).toBeAbleToSelect(this.burnedMen);
        expect(this.player1).not.toBeAbleToSelect(this.paintedDogs);
    });
});
