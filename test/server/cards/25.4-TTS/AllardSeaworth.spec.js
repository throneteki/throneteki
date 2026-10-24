describe('Allard Seaworth', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'baratheon',
                inPlay: [
                    'Allard Seaworth',
                    'Lady Marya',
                    'Ser Eldon Estermont',
                    { card: 'Ser Davos Seaworth (Core)', attachments: ['Little Bird (Core)'] }
                ]
            },
            player2: { drawDeck: ['Hedge Knight', 'Green-Apple Knight'] }
        });
        this.unopposedChallenge(this.player1, 'Power', this.serDavosSeaworth);
        this.player1.triggerAbility('Lady Marya');
        this.player1.clickCard(this.serEldonEstermont);
        this.player1.clickCard(this.ladyMarya);
        this.unopposedChallenge(this.player1, 'Military', this.allardSeaworth);
        this.player1.triggerAbility('Lady Marya');
    });

    it('discards one facedown attachment from your Baratheon card to gain power once per phase', function () {
        expect(this.hedgeKnight.parent).toBe(this.ladyMarya);
        expect(this.greenAppleKnight.parent).toBe(this.ladyMarya);
        this.player1.togglePromptedActionWindow('dominance', true);
        this.completeChallengesPhase();
        const power = this.player1Object.faction.power;
        this.player1.clickCard(this.allardSeaworth);
        expect(this.player1).toBeAbleToSelect(this.hedgeKnight);
        expect(this.player1).toBeAbleToSelect(this.greenAppleKnight);
        expect(this.player1).not.toBeAbleToSelect(this.littleBird);
        expect(this.player1).not.toBeAbleToSelect(this.ladyMarya);
        this.player1.clickCard(this.hedgeKnight);
        expect(this.hedgeKnight.location).toBe('discard pile');
        expect(this.greenAppleKnight.parent).toBe(this.ladyMarya);
        expect(this.littleBird.parent).toBe(this.serDavosSeaworth);
        expect(this.player1Object.faction.power).toBe(power + 1);
        this.player2.clickPrompt('Pass');
        expect(this.player1.actionUnavailableReason(this.allardSeaworth)).toBe('limit');
        expect(this.player1).isReadyToTakeAction();
    });

    it('cannot use the action outside dominance', function () {
        expect(this.player1.actionUnavailableReason(this.allardSeaworth)).toBe('phase');
        expect(this.hedgeKnight.parent).toBe(this.ladyMarya);
        expect(this.greenAppleKnight.parent).toBe(this.ladyMarya);
        expect(this.player1).isReadyToTakeAction();
    });
});

describe('Allard Seaworth without facedown attachments', function () {
    it('cannot discard a faceup attachment for power', function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: [{ card: 'Allard Seaworth', attachments: ['Little Bird (Core)'] }] }
        });
        this.player1.togglePromptedActionWindow('dominance', true);
        this.completeChallengesPhase();
        expect(this.player1.actionUnavailableReason(this.allardSeaworth)).toBe('cost');
        expect(this.littleBird.parent).toBe(this.allardSeaworth);
        expect(this.player1).isReadyToTakeAction();
    });
});
