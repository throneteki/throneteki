describe('Grizzled Miner', function () {
    const qualifying = [
        'Castle Black (Core)',
        'The Wall (Core)',
        {
            card: 'Steward at the Wall',
            attachments: ['Practice Blade', 'Practice Blade', 'Practice Blade']
        }
    ];

    for (const [name, inPlay, cost] of [
        ['no qualifying cards', ['Steward at the Wall', 'The Roseroad'], 5],
        ['one location', ['Castle Black (Core)'], 4],
        ['one attachment', [{ card: 'Steward at the Wall', attachments: ['Practice Blade'] }], 4],
        [
            'four qualifying cards',
            [
                'Castle Black (Core)',
                {
                    card: 'Steward at the Wall',
                    attachments: ['Practice Blade', 'Practice Blade', 'Practice Blade']
                }
            ],
            1
        ],
        ['five qualifying cards', qualifying, 1]
    ]) {
        it('pays the correct cost with ' + name, function () {
            this.setupTest({
                phase: 'marshal',
                player1: { hand: ['Grizzled Miner'], inPlay, gold: 10 },
                player2: { inPlay: ['The Haunted Forest'] }
            });
            this.player1.clickCard(this.grizzledMiner);
            expect(this.grizzledMiner.location).toBe('play area');
            expect(this.player1Object.gold).toBe(10 - cost);
            expect(this.player1).isReadyToTakeAction();
        });
    }
});
