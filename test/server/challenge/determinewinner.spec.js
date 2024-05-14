import Challenge from '../../../server/game/challenge.js';
import Player from '../../../server/game/player.js';
import DrawCard from '../../../server/game/drawcard.js';

describe('Challenge', function () {
    beforeEach(function () {
        this.gameSpy = jasmine.createSpyObj('game', ['applyGameAction', 'on', 'raiseEvent']);
        this.gameSpy.applyGameAction.and.callFake((type, card, handler) => {
            handler(card);
        });

        this.attackingPlayer = new Player(
            '1',
            { username: 'Player 1', settings: {} },
            true,
            this.gameSpy
        );
        this.defendingPlayer = new Player(
            '2',
            { username: 'Player 2', settings: {} },
            true,
            this.gameSpy
        );

        this.attackerCard = new DrawCard(this.attackingPlayer, {});
        this.defenderCard = new DrawCard(this.defendingPlayer, {});

        this.challenge = new Challenge(this.gameSpy, {
            attackingPlayer: this.attackingPlayer,
            defendingPlayer: this.defendingPlayer,
            challengeType: 'military'
        });
    });

    describe('determineWinner()', function () {
        describe('when the attacker has higher strength', function () {
            beforeEach(function () {
                spyOn(this.attackerCard, 'getStrength').and.returnValue(5);
                spyOn(this.defenderCard, 'getStrength').and.returnValue(4);
                this.challenge.addAttackers([this.attackerCard]);
                this.challenge.addDefenders([this.defenderCard]);
                this.challenge.determineWinner();
            });

            it('should have the attacking player be the winner', function () {
                expect(this.challenge.winner).toBe(this.attackingPlayer);
            });

            it('should have the defending player be the loser', function () {
                expect(this.challenge.loser).toBe(this.defendingPlayer);
            });
        });

        describe('when the attacker and defender have equal strength', function () {
            beforeEach(function () {
                spyOn(this.attackerCard, 'getStrength').and.returnValue(5);
                spyOn(this.defenderCard, 'getStrength').and.returnValue(5);
                this.challenge.addAttackers([this.attackerCard]);
                this.challenge.addDefenders([this.defenderCard]);
                this.challenge.determineWinner();
            });

            it('should have the attacking player be the winner', function () {
                expect(this.challenge.winner).toBe(this.attackingPlayer);
            });

            it('should have the defending player be the loser', function () {
                expect(this.challenge.loser).toBe(this.defendingPlayer);
            });
        });

        describe('when the defender has higher strength', function () {
            beforeEach(function () {
                spyOn(this.attackerCard, 'getStrength').and.returnValue(4);
                spyOn(this.defenderCard, 'getStrength').and.returnValue(5);
                this.challenge.addAttackers([this.attackerCard]);
                this.challenge.addDefenders([this.defenderCard]);
                this.challenge.determineWinner();
            });

            it('should have the defending player be the winner', function () {
                expect(this.challenge.winner).toBe(this.defendingPlayer);
            });

            it('should have the attacking player be the loser', function () {
                expect(this.challenge.loser).toBe(this.attackingPlayer);
            });
        });
    });
});
