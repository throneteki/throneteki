describe('Enemies in Every Shadow', function () {
    for (const name of ['Ser Jorah Mormont (LMHR)', 'Tunnels of the Red Keep']) {
        it(`discards ${name} from the losers shadows, using the dead pile for characters`, function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    plot: 'Enemies in Every Shadow (TIC)',
                    inPlay: ['House Maester', 'Ranging Party']
                },
                player2: { shadows: [name], inPlay: ['Winterfell Steward'] }
            });
            const card = this.player2.findCardByName(name, 'shadows');
            expect(this.houseMaester.getStrength()).toBe(2);
            expect(this.rangingParty.getStrength()).toBe(5);
            this.unopposedChallenge(this.player1, 'Power', this.houseMaester);
            this.player1.triggerAbility('Enemies in Every Shadow');
            expect(this.player1).toBeAbleToSelect(card);
            expect(this.player1).not.toBeAbleToSelect(this.winterfellSteward);
            expect(this.player1).not.toBeAbleToSelect(this.rangingParty);
            this.player1.clickCard(card);
            expect(card.location).toBe(
                name === 'Tunnels of the Red Keep' ? 'discard pile' : 'dead pile'
            );
            expect(this.houseMaester.getStrength()).toBe(3);
            expect(this.rangingParty.getStrength()).toBe(6);
            expect(this.winterfellSteward.getStrength()).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    }

    it('does not boost STR while you have a card in shadows and cannot target that card', function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                plot: 'Enemies in Every Shadow (TIC)',
                inPlay: ['House Maester'],
                shadows: ['Ser Jorah Mormont (LMHR)']
            }
        });
        expect(this.houseMaester.getStrength()).toBe(2);
        this.unopposedChallenge(this.player1, 'Power', this.houseMaester);
        expect(this.player1).not.toAllowAbilityTrigger('Enemies in Every Shadow');
        expect(this.serJorahMormont.location).toBe('shadows');
        expect(this.player1).isReadyToTakeAction();
    });
});
