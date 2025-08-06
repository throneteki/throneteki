import Challenge from '../../../server/game/challenge.js';
import Player from '../../../server/game/player.js';
import DrawCard from '../../../server/game/drawcard.js';
import {
    ValueContribution,
    CharacterStrengthContribution
} from '../../../server/game/ChallengeContributions.js';
import { Flags } from '../../../server/game/Constants/index.js';

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

        spyOn(this.attackerCard, 'getStrength').and.returnValue(5);
        spyOn(this.defenderCard, 'getStrength').and.returnValue(5);

        this.challenge.addAttackers([this.attackerCard]);
        this.challenge.addDefenders([this.defenderCard]);

        this.initialAttackerSTR = this.challenge.attackerStrength;
        this.initialDefenderSTR = this.challenge.defenderStrength;
    });

    describe('addContribution()', function () {
        describe('when the target is controlled by the attacking player', function () {
            beforeEach(function () {
                this.targetCard = new DrawCard(this.attackingPlayer, {});
            });

            describe("and is contributing 2 STR towards the attacking player's side", function () {
                beforeEach(function () {
                    this.contribution1 = new ValueContribution(
                        this.attackingPlayer,
                        this.targetCard,
                        2
                    );
                    this.challenge.addContribution(this.contribution1);
                });

                it("should result in attacker's total being raised by 2", function () {
                    expect(this.challenge.attackerStrength).toBe(this.initialAttackerSTR + 2);
                });

                it("should result in defender's total STR being unchanged", function () {
                    expect(this.challenge.defenderStrength).toBe(this.initialDefenderSTR);
                });

                describe("as well as 4 STR towards the defending player's side", function () {
                    beforeEach(function () {
                        this.contribution2 = new ValueContribution(
                            this.defendingPlayer,
                            this.targetCard,
                            4
                        );
                        this.challenge.addContribution(this.contribution2);
                    });

                    it("should result in attacker's total being raised by 2", function () {
                        expect(this.challenge.attackerStrength).toBe(this.initialAttackerSTR + 2);
                    });

                    it("should result in defender's total STR being raised by 4", function () {
                        expect(this.challenge.defenderStrength).toBe(this.initialDefenderSTR + 4);
                    });
                });
            });

            describe("and is contributing 2 STR towards the defending player's side", function () {
                beforeEach(function () {
                    this.contribution1 = new ValueContribution(
                        this.defendingPlayer,
                        this.targetCard,
                        2
                    );
                    this.challenge.addContribution(this.contribution1);
                });

                it("should result in attacker's total being unchanged", function () {
                    expect(this.challenge.attackerStrength).toBe(this.initialAttackerSTR);
                });

                it("should result in defender's total STR being raised by 2", function () {
                    expect(this.challenge.defenderStrength).toBe(this.initialDefenderSTR + 2);
                });

                describe("as well as 4 STR towards the attacking player's side", function () {
                    beforeEach(function () {
                        this.contribution2 = new ValueContribution(
                            this.attackingPlayer,
                            this.targetCard,
                            4
                        );
                        this.challenge.addContribution(this.contribution2);
                    });

                    it("should result in attacker's total STR being raised by 4", function () {
                        expect(this.challenge.attackerStrength).toBe(this.initialAttackerSTR + 4);
                    });

                    it("should result in defender's total STR being raised by 2", function () {
                        expect(this.challenge.defenderStrength).toBe(this.initialDefenderSTR + 2);
                    });
                });
            });

            describe("and is a character contributing it's STR (6)", function () {
                beforeEach(function () {
                    spyOn(this.targetCard, 'getStrength').and.returnValue(6);
                });

                describe("towards the attacking player's side", function () {
                    beforeEach(function () {
                        this.contribution1 = new CharacterStrengthContribution(
                            this.attackingPlayer,
                            this.targetCard
                        );
                        this.challenge.addContribution(this.contribution1);
                    });

                    it("should result in attacker's total STR being raised by that STR", function () {
                        expect(this.challenge.attackerStrength).toBe(
                            this.initialAttackerSTR + this.targetCard.getStrength()
                        );
                    });

                    it("should result in defender's total STR being unchanged", function () {
                        expect(this.challenge.defenderStrength).toBe(this.initialDefenderSTR);
                    });

                    describe("then towards the defending player's side", function () {
                        beforeEach(function () {
                            this.contribution2 = new CharacterStrengthContribution(
                                this.defendingPlayer,
                                this.targetCard
                            );
                            this.challenge.addContribution(this.contribution2);
                        });

                        it("should result in attacker's total STR being unchanged", function () {
                            expect(this.challenge.attackerStrength).toBe(this.initialAttackerSTR);
                        });

                        it("should result in defender's total STR being raised by that STR", function () {
                            expect(this.challenge.defenderStrength).toBe(
                                this.initialDefenderSTR + this.targetCard.getStrength()
                            );
                        });
                    });

                    describe('then cannot contribute its STR towards the challenge', function () {
                        beforeEach(function () {
                            this.targetCard.flags.add(
                                Flags.challengeOptions.doesNotContributeStrength
                            );
                            this.challenge.calculateStrength();
                        });

                        it("should result in attacker's total STR being unchanged", function () {
                            expect(this.challenge.attackerStrength).toBe(this.initialAttackerSTR);
                        });

                        it("should result in defender's total STR being unchanged", function () {
                            expect(this.challenge.defenderStrength).toBe(this.initialDefenderSTR);
                        });
                    });
                });
            });
        });

        describe('when the target is controlled by the defending player', function () {
            beforeEach(function () {
                this.targetCard = new DrawCard(this.defendingPlayer, {});
            });
            describe("and is contributing 2 STR towards the attacking player's side", function () {
                beforeEach(function () {
                    this.contribution1 = new ValueContribution(
                        this.attackingPlayer,
                        this.targetCard,
                        2
                    );
                    this.challenge.addContribution(this.contribution1);
                });

                it("should result in attacker's total being raised by 2", function () {
                    expect(this.challenge.attackerStrength).toBe(this.initialAttackerSTR + 2);
                });

                it("should result in defender's total STR being unchanged", function () {
                    expect(this.challenge.defenderStrength).toBe(this.initialDefenderSTR);
                });
            });
        });

        describe('when the target is already participating as an attacker in the challenge', function () {
            beforeEach(function () {
                this.targetCard = new DrawCard(this.attackingPlayer, {});

                spyOn(this.targetCard, 'getStrength').and.returnValue(5);

                this.challenge.addAttackers([this.targetCard]);

                this.initialAttackerSTR = this.challenge.attackerStrength;
            });

            describe("and it contributes 3 STR towards the attacking player's side", function () {
                beforeEach(function () {
                    this.contribution1 = new ValueContribution(
                        this.attackingPlayer,
                        this.targetCard,
                        3
                    );
                    this.challenge.addContribution(this.contribution1);
                });

                it("should result in attacker's total STR being raised by 3", function () {
                    expect(this.challenge.attackerStrength).toBe(this.initialAttackerSTR + 3);
                });

                it("should result in defender's total STR being unchanged", function () {
                    expect(this.challenge.defenderStrength).toBe(this.initialDefenderSTR);
                });
            });

            describe("and it contributes 3 STR towards the defending player's side", function () {
                beforeEach(function () {
                    this.contribution1 = new ValueContribution(
                        this.defendingPlayer,
                        this.targetCard,
                        3
                    );
                    this.challenge.addContribution(this.contribution1);
                });

                it("should result in attacker's total STR being unchanged", function () {
                    expect(this.challenge.attackerStrength).toBe(this.initialAttackerSTR);
                });

                it("should result in defender's total STR being raised by 3", function () {
                    expect(this.challenge.defenderStrength).toBe(this.initialDefenderSTR + 3);
                });
            });

            describe("and it contributes it's STR (5) towards the attacking player's side", function () {
                beforeEach(function () {
                    this.contribution1 = new CharacterStrengthContribution(
                        this.attackingPlayer,
                        this.targetCard
                    );
                    this.challenge.addContribution(this.contribution1);
                });

                it("should result in attacker's total STR being unchanged", function () {
                    expect(this.challenge.attackerStrength).toBe(this.initialAttackerSTR);
                });

                it("should result in defender's total STR being unchanged", function () {
                    expect(this.challenge.defenderStrength).toBe(this.initialDefenderSTR);
                });

                describe('then is removed from the challenge', function () {
                    beforeEach(function () {
                        this.challenge.removeFromChallenge(this.targetCard);
                    });

                    it("should result in attacker's total STR being unchanged", function () {
                        expect(this.challenge.attackerStrength).toBe(this.initialAttackerSTR);
                    });

                    it("should result in defender's total STR being unchanged", function () {
                        expect(this.challenge.defenderStrength).toBe(this.initialDefenderSTR);
                    });
                });
            });

            describe("and it contributes it's STR (5) towards the defending player's side", function () {
                beforeEach(function () {
                    this.contribution1 = new CharacterStrengthContribution(
                        this.defendingPlayer,
                        this.targetCard
                    );
                    this.challenge.addContribution(this.contribution1);
                });

                it("should result in attacker's total STR being reduced by that STR", function () {
                    expect(this.challenge.attackerStrength).toBe(
                        this.initialAttackerSTR - this.targetCard.getStrength()
                    );
                });

                it("should result in defender's total STR being raised by that STR", function () {
                    expect(this.challenge.defenderStrength).toBe(
                        this.initialDefenderSTR + this.targetCard.getStrength()
                    );
                });

                describe("then contributes to the attacking player's side again", function () {
                    beforeEach(function () {
                        this.contribution2 = new CharacterStrengthContribution(
                            this.attackingPlayer,
                            this.targetCard
                        );
                        this.challenge.addContribution(this.contribution2);
                    });

                    it("should result in attacker's total STR being unchanged", function () {
                        expect(this.challenge.attackerStrength).toBe(this.initialAttackerSTR);
                    });

                    it("should result in defender's total STR being unchanged", function () {
                        expect(this.challenge.defenderStrength).toBe(this.initialDefenderSTR);
                    });

                    describe('then is removed from the challenge', function () {
                        beforeEach(function () {
                            this.challenge.removeFromChallenge(this.targetCard);
                        });

                        it("should result in attacker's total STR being unchanged", function () {
                            expect(this.challenge.attackerStrength).toBe(this.initialAttackerSTR);
                        });

                        it("should result in defender's total STR being unchanged", function () {
                            expect(this.challenge.defenderStrength).toBe(this.initialDefenderSTR);
                        });
                    });
                });

                describe("then has it's STR raised (by 2)", function () {
                    beforeEach(function () {
                        this.previousTargetCardSTR = this.targetCard.getStrength();
                        this.targetCard.getStrength.and.returnValue(
                            this.targetCard.getStrength() + 2
                        );
                        this.challenge.calculateStrength();
                    });

                    it("should result in attacker's total STR being reduced by the previous STR", function () {
                        expect(this.challenge.attackerStrength).toBe(
                            this.initialAttackerSTR - this.previousTargetCardSTR
                        );
                    });

                    it("should result in defender's total STR being raised by the new STR", function () {
                        expect(this.challenge.defenderStrength).toBe(
                            this.initialDefenderSTR + this.targetCard.getStrength()
                        );
                    });
                });

                describe('then cannot contribute its STR towards the challenge', function () {
                    beforeEach(function () {
                        this.targetCard.flags.add(Flags.challengeOptions.doesNotContributeStrength);
                        this.challenge.calculateStrength();
                    });

                    it("should result in attacker's total STR being reduced by that STR", function () {
                        expect(this.challenge.attackerStrength).toBe(
                            this.initialAttackerSTR - this.targetCard.getStrength()
                        );
                    });

                    it("should result in defender's total STR being unchanged", function () {
                        expect(this.challenge.defenderStrength).toBe(this.initialDefenderSTR);
                    });
                });
            });
        });
    });

    describe('removeContribution()', function () {
        describe('when the target is controlled by attacking player', function () {
            beforeEach(function () {
                this.targetCard = new DrawCard(this.attackingPlayer, {});
            });

            describe("then contributes it's STR to the defenders side", function () {
                beforeEach(function () {
                    this.contribution1 = new CharacterStrengthContribution(
                        this.defendingPlayer,
                        this.targetCard
                    );
                    this.challenge.addContribution(this.contribution1);
                });

                describe("then no longer contributes it's STR to the defenders side", function () {
                    beforeEach(function () {
                        this.challenge.removeContribution(this.contribution1);
                    });

                    it("should result in attacker's total STR being unchanged", function () {
                        expect(this.challenge.attackerStrength).toBe(this.initialAttackerSTR);
                    });

                    it("should result in defender's total STR being unchanged", function () {
                        expect(this.challenge.defenderStrength).toBe(this.initialDefenderSTR);
                    });
                });
            });
        });
    });
});
