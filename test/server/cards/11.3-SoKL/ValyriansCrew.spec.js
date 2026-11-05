describe("Valyrian's Crew", function () {
    function setup(topCard, { player1 = {}, player2 = {}, challenge = 'Intrigue' } = {}) {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'baratheon',
                inPlay: ["Valyrian's Crew"],
                drawDeck: ['Dragonstone Faithful'],
                ...player1
            },
            player2: { drawDeck: [topCard], ...player2 }
        });
        this.topCard = this.player2Object.drawDeck[0];
        this.unopposedChallenge(this.player1, challenge, this.valyriansCrew);
        this.player1.triggerAbility("Valyrian's Crew");
    }

    function nextRound(firstPlayer, player2Plot = 'Filler Plot') {
        this.completeChallengesPhase();
        this.player1.selectPlot('Filler Plot');
        this.player2.selectPlot(player2Plot);
        this.selectFirstPlayer(firstPlayer);
    }

    describe('when winning a challenge', function () {
        it('attaches the top card of the losing opponent deck facedown under your control as a Terminal attachment', function () {
            setup.call(this, 'Arya Stark (Core)');
            expect(this.valyriansCrew.attachments).toContain(this.topCard);
            expect(this.topCard.facedown).toBe(true);
            expect(this.topCard).toBeControlledBy(this.player1);
            expect(this.topCard.getType()).toBe('attachment');
            expect(this.topCard.isTerminal()).toBe(true);
        });

        it('lets you marshal a facedown character as if it were in your hand, with effects applied to it', function () {
            setup.call(this, 'Arya Stark (Core)', {
                player2: { plotDeck: ['Blood of the Dragon', 'Filler Plot'] }
            });
            nextRound.call(this, this.player1, 'Blood of the Dragon');
            this.player1.clickCard(this.topCard);
            expect(this.player1Object.cardsInPlay).toContain(this.topCard);
            expect(this.topCard.getType()).toBe('character');
            expect(this.topCard).toBeControlledBy(this.player1);
            // Printed 2 STR - 1 STR from Blood of the Dragon
            expect(this.topCard.getStrength()).toBe(1);
        });

        it('does not stop the opponent marshaling a copy of a facedown unique card', function () {
            setup.call(this, 'Arya Stark (Core)', {
                player2: { hand: ['Arya Stark (Core)'] },
                challenge: 'Military'
            });
            const copy = this.player2Object.hand[0];
            nextRound.call(this, this.player2);
            this.player2.clickCard(copy);
            expect(copy.location).toBe('play area');
        });
    });

    describe('when attaching a facedown attachment', function () {
        beforeEach(function () {
            setup.call(this, 'Longclaw');
        });

        it('attaches it regardless of its restrictions', function () {
            expect(this.valyriansCrew.attachments).toContain(this.topCard);
        });

        it('does not grant the effects the attachment normally grants', function () {
            expect(this.valyriansCrew.getStrength()).toBe(this.valyriansCrew.getPrintedStrength());
        });
    });

    it('lets you marshal a facedown attachment', function () {
        setup.call(this, 'Noble Lineage');
        nextRound.call(this, this.player1);
        this.player1.clickCard(this.topCard);
        this.player1.clickCard(this.valyriansCrew);
        expect(this.topCard.facedown).toBe(false);
        expect(this.valyriansCrew.attachments).toContain(this.topCard);
        expect(this.valyriansCrew.hasIcon('power')).toBe(true);
    });

    it('lets you play a facedown action event', function () {
        setup.call(this, 'Nightmares');
        this.player1.clickCard(this.topCard);
        this.player1.clickCard(this.valyriansCrew);
        expect(this.valyriansCrew.isAnyBlank()).toBe(true);
    });

    it('lets you trigger a facedown triggered event', function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'baratheon',
                inPlay: ["Valyrian's Crew"],
                drawDeck: ['Dragonstone Faithful']
            },
            player2: { drawDeck: ["Olenna's Cunning"] }
        });
        this.topCard = this.player2Object.drawDeck[0];
        this.unopposedChallenge(this.player1, 'Intrigue', this.valyriansCrew);
        this.player1.triggerAbility("Valyrian's Crew");
        expect(this.player1).toAllowAbilityTrigger(this.topCard);
    });
});
