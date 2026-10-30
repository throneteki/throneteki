import { Tokens } from '../../../../server/game/Constants/index.js';

describe('Lingering Venom', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [
                    'Hedge Knight',
                    {
                        card: 'House Dayne Knight',
                        attachments: [{ card: 'Lingering Venom', owner: 'player2' }]
                    },
                    {
                        card: 'Winterfell Steward',
                        attachments: [{ card: 'Lingering Venom', owner: 'player2' }]
                    }
                ]
            }
        });
        [this.knightVenom, this.stewardVenom] = [
            this.houseDayneKnight.attachments[0],
            this.winterfellSteward.attachments[0]
        ];
        this.unopposedChallenge(this.player1, 'Military', this.hedgeKnight);
    });

    it('places a venom token after you lose a challenge', function () {
        this.player2.triggerAbility(this.knightVenom);

        expect(this.knightVenom.tokens[Tokens.venom]).toBe(1);
        expect(this.houseDayneKnight.location).toBe('play area');
    });

    it('then kills the attached character once its STR is no higher than the venom tokens', function () {
        this.player2.triggerAbility(this.stewardVenom);

        expect(this.winterfellSteward.location).toBe('dead pile');
    });
});
