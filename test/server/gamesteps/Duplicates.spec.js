import GameActions from '../../../server/game/GameActions/index.js';
describe('duplicates', function () {
    function watchDupes(context) {
        context.seen = [];
        context.houseMaester.reaction({
            when: { onDupeEntersPlay: () => true },
            gameAction: GameActions.genericHandler(
                (abilityContext) => context.seen.push(abilityContext.event),
                () => true
            )
        });
        context.houseMaester.abilities.reactions.at(-1).registerEvents();
    }

    describe('when a character is marshaled as a duplicate', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    hand: ['Ser Barristan Selmy (LoCR)'],
                    inPlay: ['Ser Barristan Selmy (LoCR)', 'House Maester']
                }
            });
            watchDupes(this);

            this.duplicate = this.player1.findCardByName('Ser Barristan Selmy', 'hand');
            this.player1.clickCard(this.duplicate);
        });

        it('is placed on the copy in play, for free, and raises onDupeEntersPlay', function () {
            expect(this.serBarristanSelmy.dupes).toContain(this.duplicate);
            expect(this.duplicate.location).toBe('duplicate');
            expect(this.player1Object.cardsInPlay).not.toContain(this.duplicate);
            expect(this.player1Object.gold).toBe(5);

            this.player1.triggerAbility(this.houseMaester);

            expect(this.seen[0].card).toBe(this.duplicate);
            expect(this.seen[0].target).toBe(this.serBarristanSelmy);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when an attachment is marshaled as a duplicate', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    faction: 'thenightswatch',
                    hand: ['Longclaw'],
                    inPlay: [
                        { card: 'Steward at the Wall', attachments: ['Longclaw'] },
                        'House Maester'
                    ]
                }
            });
            watchDupes(this);

            this.duplicate = this.player1.findCardByName('Longclaw', 'hand');
            this.player1.clickCard(this.duplicate);
        });

        it('is placed on the copy in play without choosing a character', function () {
            expect(this.longclaw.dupes).toContain(this.duplicate);
            expect(this.player1Object.hand).not.toContain(this.duplicate);

            this.player1.triggerAbility(this.houseMaester);

            expect(this.seen[0].target).toBe(this.longclaw);
        });
    });

    describe('when a character is ambushed as a duplicate', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    faction: 'martell',
                    hand: ['Areo Hotah (Core)'],
                    inPlay: ['Areo Hotah (Core)', 'House Maester']
                }
            });
            watchDupes(this);

            this.duplicate = this.player1.findCardByName('Areo Hotah', 'hand');
            this.player1.clickCard(this.duplicate);
        });

        it('is placed on the copy in play', function () {
            expect(this.areoHotah.dupes).toContain(this.duplicate);

            this.player1.triggerAbility(this.houseMaester);

            expect(this.seen[0].card).toBe(this.duplicate);
        });
    });
});
