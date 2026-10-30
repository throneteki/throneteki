describe('Risen from the Sea', function () {
    function setup({ player1 = {}, player2 = {} } = {}) {
        this.setupTest({
            phase: 'challenge',
            firstPlayer: 'player2',
            player1: {
                faction: 'greyjoy',
                inPlay: ['Theon Greyjoy (Core)', 'Drowned Men'],
                hand: ['Risen from the Sea'],
                ...player1
            },
            player2: {
                faction: 'targaryen',
                inPlay: ['Viserion (Core)'],
                ...player2
            }
        });
    }

    describe('when a character is killed normally', function () {
        beforeEach(function () {
            setup.call(this);
            this.unopposedChallenge(this.player2, 'Military', this.viserion);
            this.player1.clickCard(this.theonGreyjoy);
            this.player1.triggerAbility('Risen from the Sea');
        });

        it('saves the character', function () {
            expect(this.theonGreyjoy.location).toBe('play area');
        });

        it('attaches itself to the character as a Terminal Condition attachment', function () {
            expect(this.theonGreyjoy.attachments).toContain(this.risenFromTheSea);
            expect(this.risenFromTheSea.getType()).toBe('attachment');
            expect(this.risenFromTheSea.hasTrait('Condition')).toBe(true);
            expect(this.risenFromTheSea.isTerminal()).toBe(true);
        });

        it('gives the attached character +1 STR', function () {
            expect(this.theonGreyjoy.getStrength()).toBe(4);
        });
    });

    describe('when a no-attachments character is killed', function () {
        beforeEach(function () {
            setup.call(this);
            this.unopposedChallenge(this.player2, 'Military', this.viserion);
            this.player1.clickCard(this.drownedMen);
            this.player1.triggerAbility('Risen from the Sea');
        });

        it('saves the character without attaching to it', function () {
            expect(this.drownedMen.location).toBe('play area');
            expect(this.drownedMen.attachments.length).toBe(0);
            expect(this.risenFromTheSea.location).toBe('discard pile');
            expect(this.drownedMen.getStrength()).toBe(3);
        });
    });

    describe('when a character is killed via burn', function () {
        function burn(target, inPlay = []) {
            setup.call(this, {
                player1: {
                    inPlay: [
                        'Theon Greyjoy (Core)',
                        'Asha Greyjoy (Core)',
                        'Drowned Men',
                        ...inPlay
                    ]
                },
                player2: {
                    inPlay: ['Viserion (Core)', 'Drogon (Core)'],
                    hand: ['Dracarys!']
                }
            });
            this.player2.clickPrompt('Military');
            this.player2.clickCard(this.viserion);
            this.player2.clickPrompt('Done');
            this.skipActionWindow();
            this.player1.clickCard(this.theonGreyjoy);
            this.player1.clickCard(this.ashaGreyjoy);
            this.player1.clickCard(this.drownedMen);
            this.player1.clickPrompt('Done');
            this.player2.clickCard(this.dracarys);
            this.player2.clickCard(this.drogon);
            this.player2.clickCard(target.call(this));
        }

        it('saves a character that reaches 1 STR through Risen', function () {
            burn.call(this, function () {
                return this.ashaGreyjoy;
            });
            this.player1.triggerAbility('Risen from the Sea');
            expect(this.ashaGreyjoy.location).toBe('play area');
            expect(this.ashaGreyjoy.getStrength()).toBe(1);
        });

        it('cannot save a character that could reach 1 STR but cannot have attachments', function () {
            burn.call(
                this,
                function () {
                    return this.drownedMen;
                },
                ['Iron Fleet Scout']
            );
            expect(this.player1).not.toAllowAbilityTrigger('Risen from the Sea');
            expect(this.drownedMen.location).toBe('dead pile');
        });

        it('cannot save a character that cannot reach 1 STR through Risen', function () {
            burn.call(this, function () {
                return this.theonGreyjoy;
            });
            expect(this.player1).not.toAllowAbilityTrigger('Risen from the Sea');
            expect(this.theonGreyjoy.location).toBe('dead pile');
        });
    });

    describe('when blanked', function () {
        beforeEach(function () {
            setup.call(this, {
                player2: {
                    faction: 'stark',
                    inPlay: [
                        'Viserion (Core)',
                        { card: 'House Tully Septon', attachments: ["Brother's Robes"] }
                    ]
                }
            });
            this.unopposedChallenge(this.player2, 'Military', this.viserion);
            this.player1.clickCard(this.theonGreyjoy);
            this.player1.triggerAbility('Risen from the Sea');
            this.player2.clickPrompt('Power');
            this.player2.clickCard(this.houseTullySepton);
            this.player2.clickPrompt('Done');
            this.player2.triggerAbility("Brother's Robes");
            this.player2.clickCard(this.risenFromTheSea);
        });

        it('does not remove the +1 STR bonus', function () {
            expect(this.risenFromTheSea.isAnyBlank()).toBe(true);
            expect(this.theonGreyjoy.getStrength()).toBe(4);
        });
    });
});
