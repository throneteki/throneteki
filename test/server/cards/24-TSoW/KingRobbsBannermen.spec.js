describe("King Robb's Bannermen", function () {
    function setup(context, king) {
        context.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ["King Robb's Bannermen (TSoW)", king].filter(Boolean)
            },
            player2: {
                inPlay: ['The Kingsroad', 'Heart Tree Grove', 'The Wall (TMoW)', 'House Maester']
            }
        });
    }

    function declareMilitary(context) {
        context.player1.clickPrompt('Military');
        context.player1.clickCard(context.kingRobbsBannermen);
        context.player1.clickPrompt('Done');
    }

    describe('while you control a Stark King', function () {
        beforeEach(function () {
            setup(this, 'Robb Stark (AtSK)');
            declareMilitary(this);
        });

        it('may target one additional location with assault', function () {
            expect(this.player1).toHavePrompt(
                "Select up to 2 assault targets for King Robb's Bannermen"
            );
            expect(this.player1).toBeAbleToSelect(this.theKingsroad);
            expect(this.player1).toBeAbleToSelect(this.heartTreeGrove);
            expect(this.player1).not.toBeAbleToSelect(this.theWall);
            expect(this.player1).not.toBeAbleToSelect(this.houseMaester);

            this.player1.clickCard(this.theKingsroad);

            expect(this.player1).toBeAbleToSelect(this.heartTreeGrove);
            expect(this.player1).not.toBeAbleToSelect(this.theWall);
            this.player1.clickCard(this.heartTreeGrove);
            this.player1.clickPrompt('Done');

            expect(this.theKingsroad.targetedByAssault).toBe(true);
            expect(this.heartTreeGrove.targetedByAssault).toBe(true);
            expect(this.theWall.targetedByAssault).toBe(false);
            expect(this.player1).toHavePrompt('Initiate an action');
        });
    });

    describe('while you do not control a Stark King', function () {
        beforeEach(function () {
            setup(this, 'Renly Baratheon (FotS)');
            declareMilitary(this);
        });

        it('targets a single location', function () {
            expect(this.player1).toHavePrompt("Select assault target for King Robb's Bannermen");
            expect(this.player1).toBeAbleToSelect(this.theKingsroad);
            expect(this.player1).not.toBeAbleToSelect(this.theWall);

            this.player1.clickCard(this.theKingsroad);

            expect(this.theKingsroad.targetedByAssault).toBe(true);
            expect(this.player1).toHavePrompt('Initiate an action');
        });
    });
});
