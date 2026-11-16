import { Tokens } from '../../server/game/Constants/index.js';

describe('interrupts to a card that has already left play', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                plotDeck: ['The Stranger (HMW)'],
                inPlay: ['Ser Andrew Estermont', 'Alester Florent']
            },
            player2: {
                inPlay: [{ card: 'Bronn (HMW)', tokens: { [Tokens.gold]: 2 } }, 'Ranging Party']
            }
        });
        this.player1.selectPlot('The Stranger');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.player1.clickCard(this.rangingParty);
        this.player2.clickCard(this.serAndrewEstermont);
    });

    it('are not offered once a character being killed is killed as a cost', function () {
        this.player1.triggerAbility(this.serAndrewEstermont);
        this.player1.clickCard(this.serAndrewEstermont);
        this.player1.clickCard(this.alesterFlorent);

        expect(this.player2).not.toAllowAbilityTrigger(this.bronn);
        expect(this.alesterFlorent.location).toBe('dead pile');
        expect(this.serAndrewEstermont.location).toBe('play area');
        expect(this.serAndrewEstermont.power).toBe(1);
        expect(this.rangingParty.location).toBe('dead pile');
        expect(this.bronn.location).toBe('play area');
        expect(this.bronn.tokens[Tokens.gold]).toBe(2);
        expect(this.player1).isReadyToTakeAction();
    });

    it('are still offered for a character that is still being killed', function () {
        this.player1.clickPrompt('Pass');

        expect(this.player2).toAllowAbilityTrigger(this.bronn);
        this.player2.triggerAbility(this.bronn);
        this.player1.clickPrompt('Pass');

        expect(this.alesterFlorent.location).toBe('play area');
        expect(this.serAndrewEstermont.location).toBe('dead pile');
        expect(this.rangingParty.location).toBe('dead pile');
        expect(this.bronn.location).toBe('play area');
        expect(this.bronn.tokens[Tokens.gold]).toBeUndefined();
        expect(this.player1).isReadyToTakeAction();
    });
});
