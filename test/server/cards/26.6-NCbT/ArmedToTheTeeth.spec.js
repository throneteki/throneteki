describe('Armed to the Teeth', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                agenda: 'Armed to the Teeth',
                deck: ["Widow's Wail"],
                inPlay: ['Hedge Knight'],
                gold: 3
            },
            beforeMulligan() {
                this.player1.clickCard(this.widowsWail);
                this.player1.clickPrompt('Done');
            }
        });
        expect(this.widowsWail.location).toBe('underneath');
        expect(this.widowsWail.facedown).toBe(true);
        this.unopposedChallenge(this.player1, 'Military', this.hedgeKnight);
        this.player1.triggerAbility('Armed to the Teeth');
        this.player1.clickCard(this.widowsWail);
        this.player1.clickCard(this.hedgeKnight);
    });

    it('kneels your faction card and pays X gold after you win to put an attachment with cost X into play from under it', function () {
        expect(this.player1Object.faction.kneeled).toBe(true);
        expect(this.widowsWail.parent).toBe(this.hedgeKnight);
        expect(this.player1Object.gold).toBe(2);
        expect(this.widowsWail.facedown).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});

describe('Armed to the Teeth setup search', function () {
    it('places up to five different Weapons facedown and excludes other attachments', function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                agenda: 'Armed to the Teeth',
                deck: [
                    "Widow's Wail",
                    'Longclaw',
                    'Ice (Core)',
                    'Dawn',
                    'Heartsbane',
                    'Practice Blade',
                    'Bodyguard'
                ]
            },
            beforeMulligan() {
                expect(this.player1).not.toBeAbleToSelect(this.bodyguard);
                for (const card of [
                    this.widowsWail,
                    this.longclaw,
                    this.ice,
                    this.dawn,
                    this.heartsbane
                ]) {
                    expect(this.player1).toBeAbleToSelect(card);
                    this.player1.clickCard(card);
                }
                expect(this.player1Object.getSelectedCards()).toHaveLength(5);
                this.player1.clickCard(this.practiceBlade);
                expect(this.player1Object.getSelectedCards()).toHaveLength(5);
                this.player1.clickPrompt('Done');
            }
        });
        expect(this.player1Object.agenda.underneath).toHaveLength(5);
        for (const card of [this.widowsWail, this.longclaw, this.ice, this.dawn, this.heartsbane]) {
            expect(card.location).toBe('underneath');
            expect(card.facedown).toBe(true);
        }
        expect(this.practiceBlade.location).not.toBe('underneath');
        expect(this.bodyguard.location).not.toBe('underneath');
        expect(this.player1).isReadyToTakeAction();
    });

    it('does not allow two copies of the same attachment', function () {
        this.setupTest({
            phase: 'challenge',
            player1: { agenda: 'Armed to the Teeth', deck: ["Widow's Wail", "Widow's Wail"] },
            beforeMulligan() {
                const copies = this.player1.filterCardsByName("Widow's Wail", 'draw deck');
                expect(copies).toHaveLength(2);
                this.player1.clickCard(copies[0]);
                expect(this.player1).not.toBeAbleToSelect(copies[1]);
                this.player1.clickPrompt('Done');
            }
        });
        expect(this.player1Object.agenda.underneath).toHaveLength(1);
        expect(this.player1).isReadyToTakeAction();
    });

    it('allows taking no attachments', function () {
        this.setupTest({
            phase: 'challenge',
            player1: { agenda: 'Armed to the Teeth', deck: ["Widow's Wail"] },
            beforeMulligan() {
                this.player1.clickPrompt('Done');
            }
        });
        expect(this.player1Object.agenda.underneath).toEqual([]);
        expect(this.widowsWail.location).not.toBe('underneath');
        expect(this.player1).isReadyToTakeAction();
    });
});
