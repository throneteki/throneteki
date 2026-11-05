describe('Tyrion Lannister (LoCR)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Tyrion Lannister (LoCR)', 'Burned Men', 'Moon Brothers', 'House Maester'],
                hand: ['Stone Crows']
            },
            player2: { inPlay: ['Ranging Party'] }
        });
    });

    function returnAttacker(context) {
        context.unopposedChallenge(context.player1, 'Military', context.burnedMen);
        expect(context.player1).toAllowAbilityTrigger('Tyrion Lannister');
        context.player1.triggerAbility('Tyrion Lannister');
        expect(context.player1).toBeAbleToSelect(context.burnedMen);
        for (const card of [
            context.tyrionLannister,
            context.moonBrothers,
            context.houseMaester,
            context.stoneCrows,
            context.rangingParty
        ]) {
            expect(context.player1).not.toBeAbleToSelect(card);
        }
        context.player1.clickCard(context.burnedMen);
    }

    it('returns an attacking Clansman to draw exactly two cards', function () {
        const hand = this.player1Object.hand.length;
        const opponentHand = this.player2Object.hand.length;
        returnAttacker(this);
        this.player1.clickPrompt('Draw 2 cards');
        expect(this.burnedMen.location).toBe('hand');
        expect(this.player1Object.hand.length).toBe(hand + 3);
        expect(this.player2Object.hand.length).toBe(opponentHand);
        this.player2.clickCard(this.rangingParty);
        expect(this.player1).isReadyToTakeAction();
    });

    it('returns an attacking Clansman to gain exactly three gold', function () {
        const gold = this.player1Object.gold;
        const opponentGold = this.player2Object.gold;
        returnAttacker(this);
        this.player1.clickPrompt('Gain 3 gold');
        expect(this.burnedMen.location).toBe('hand');
        expect(this.player1Object.gold).toBe(gold + 3);
        expect(this.player2Object.gold).toBe(opponentGold);
        this.player2.clickCard(this.rangingParty);
        expect(this.player1).isReadyToTakeAction();
    });

    it('raises your claim by one for this challenge and expires afterwards', function () {
        returnAttacker(this);
        expect(this.player1).toHavePromptButton('Raise claim by 1');
        this.player1.clickPrompt('Raise claim by 1');
        expect(this.player1Object.getClaim()).toBe(2);
        expect(this.player2Object.getClaim()).toBe(1);
        this.player2.clickCard(this.rangingParty);
        this.player2.clickPrompt('Done');
        expect(this.rangingParty.location).toBe('dead pile');
        expect(this.player1Object.getClaim()).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });

    it('can react only once to a single win even with another attacking Clansman', function () {
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.burnedMen);
        this.player1.clickCard(this.moonBrothers);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.triggerAbility('Tyrion Lannister');
        expect(this.player1).toBeAbleToSelect(this.burnedMen);
        expect(this.player1).toBeAbleToSelect(this.moonBrothers);
        this.player1.clickCard(this.burnedMen);
        this.player1.clickPrompt('Gain 3 gold');
        expect(this.player1).not.toAllowAbilityTrigger('Tyrion Lannister');
        expect(this.moonBrothers.location).toBe('play area');
        this.player2.clickCard(this.rangingParty);
        expect(this.player1).isReadyToTakeAction();
    });

    it('is not offered without an attacking Clansman even when you win', function () {
        this.unopposedChallenge(this.player1, 'Military', this.tyrionLannister);
        expect(this.player1).not.toAllowAbilityTrigger('Tyrion Lannister');
        this.player2.clickCard(this.rangingParty);
        expect(this.burnedMen.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });

    it('is not offered after losing a challenge with an attacking Clansman', function () {
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.burnedMen);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.rangingParty);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        expect(this.player1).not.toAllowAbilityTrigger('Tyrion Lannister');
        expect(this.burnedMen.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});

describe('Tyrion Lannister (LoCR) limits', function () {
    it('can react to two wins but cannot react a third time in the phase', function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [
                    'Tyrion Lannister (LoCR)',
                    'Burned Men',
                    { card: 'Moon Brothers', attachments: ['Little Bird (Core)'] },
                    { card: 'Stone Crows', attachments: ['Noble Lineage'] }
                ]
            }
        });
        const gold = this.player1Object.gold;
        for (const [type, card] of [
            ['Military', this.burnedMen],
            ['Intrigue', this.moonBrothers]
        ]) {
            this.unopposedChallenge(this.player1, type, card);
            expect(this.player1).toAllowAbilityTrigger('Tyrion Lannister');
            this.player1.triggerAbility('Tyrion Lannister');
            this.player1.clickCard(card);
            this.player1.clickPrompt('Gain 3 gold');
            expect(card.location).toBe('hand');
        }
        expect(this.player1Object.gold).toBe(gold + 6);
        this.unopposedChallenge(this.player1, 'Power', this.stoneCrows);
        expect(this.player1).not.toAllowAbilityTrigger('Tyrion Lannister');
        expect(this.stoneCrows.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });

    it('disables drawing with an empty deck while leaving the other choices available', function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Tyrion Lannister (LoCR)', 'Burned Men'],
                shadows: ['A Mission in Essos (MoD)'],
                gold: 2
            }
        });
        this.player1.clickCard(this.aMissionInEssos);
        expect(this.player1Object.drawDeck.length).toBe(0);
        this.unopposedChallenge(this.player1, 'Military', this.burnedMen);
        this.player1.triggerAbility('Tyrion Lannister');
        this.player1.clickCard(this.burnedMen);
        expect(this.player1).toHaveDisabledPromptButton('Draw 2 cards');
        expect(this.player1).toHavePromptButton('Gain 3 gold');
        expect(this.player1).toHavePromptButton('Raise claim by 1');
        this.player1.clickPrompt('Gain 3 gold');
        expect(this.player1).isReadyToTakeAction();
    });
});
