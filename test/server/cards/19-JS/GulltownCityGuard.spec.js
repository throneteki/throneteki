describe('Gulltown City Guard', function () {
    const cities = [
        'City of Secrets',
        'At the Gates',
        'City of Spiders',
        'A City Besieged',
        'City of Wealth',
        'Manning the City Walls (PoS)'
    ];

    for (const count of [0, 1, 4, 5, 6]) {
        it('pays the correct cost with ' + count + ' City plots in the used pile', function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    hand: ['Gulltown City Guard (JS)'],
                    usedPlots: [...cities.slice(0, count), 'A Noble Cause'],
                    gold: 10
                },
                player2: { usedPlots: ['City of Secrets'] }
            });
            this.player1.clickCard(this.gulltownCityGuard);
            expect(this.gulltownCityGuard.location).toBe('play area');
            expect(this.player1Object.gold).toBe(10 - Math.max(1, 6 - count));
            expect(this.player1).isReadyToTakeAction();
        });
    }
});
