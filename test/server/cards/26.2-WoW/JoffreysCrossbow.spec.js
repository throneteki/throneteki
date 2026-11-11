describe("Joffrey's Crossbow", function () {
    it('gives Joffrey Baratheon intimidate', function () {
        this.setupTest({
            player1: {
                inPlay: [{ card: 'Joffrey Baratheon (Core)', attachments: ["Joffrey's Crossbow"] }]
            }
        });

        expect(this.joffreyBaratheon.hasKeyword('Intimidate')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });

    it('makes unique characters be chosen for [military] claim while the attached character attacks', function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [
                    { card: 'Ser Jaime Lannister (Core)', attachments: ["Joffrey's Crossbow"] }
                ]
            },
            player2: {
                inPlay: ['Khal Drogo (Core)', 'Tumblestone Knight']
            }
        });

        this.unopposedChallenge(this.player1, 'Military', this.serJaimeLannister);

        expect(this.player2).toBeAbleToSelect(this.khalDrogo);
        expect(this.player2).not.toBeAbleToSelect(this.tumblestoneKnight);

        this.player2.clickCard(this.khalDrogo);

        expect(this.player1).isReadyToTakeAction();
    });
});
