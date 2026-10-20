import effects from '../../../server/game/effects.js';
import GameActions from '../../../server/game/GameActions/index.js';

describe('lasting effects', function () {
    describe('the cards a lasting effect applies to', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    inPlay: ['Hedge Knight', { card: 'House Maester', kneeling: true }],
                    hand: ['Tumblestone Knight']
                }
            });

            this.game.addEffect(this.hedgeKnight, {
                duration: 'untilEndOfPhase',
                match: (card) => card.getType() === 'character' && !card.kneeled,
                effect: effects.addTrait('Army')
            });
        });

        it('keeps the cards that were eligible when it was created', function () {
            expect(this.hedgeKnight.hasTrait('Army')).toBe(true);
            expect(this.houseMaester.hasTrait('Army')).toBe(false);

            this.player1.clickCard(this.tumblestoneKnight);
            this.game.resolveGameAction(GameActions.standCard({ card: this.houseMaester }));
            this.game.continue();

            expect(this.tumblestoneKnight.location).toBe('play area');
            expect(this.tumblestoneKnight.hasTrait('Army')).toBe(false);
            expect(this.houseMaester.kneeled).toBe(false);
            expect(this.houseMaester.hasTrait('Army')).toBe(false);
            expect(this.hedgeKnight.hasTrait('Army')).toBe(true);

            this.game.resolveGameAction(GameActions.kneelCard({ card: this.hedgeKnight }));
            this.game.continue();

            expect(this.hedgeKnight.hasTrait('Army')).toBe(true);
            expect(this.player1).toHavePrompt('Marshal your cards');
        });
    });

    describe('the end of a phase', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    inPlay: ['Hedge Knight']
                },
                player2: {
                    inPlay: ['Tumblestone Knight']
                }
            });

            this.order = [];
            this.hedgeKnight.interrupt({
                when: {
                    onPhaseEnded: (event) => event.phase === 'marshal'
                },
                handler: (context) => {
                    this.order.push(
                        this.hedgeKnight.hasTrait('Army') ? 'interrupt' : 'interrupt-gone'
                    );
                    context.game.addEffect(this.hedgeKnight, {
                        duration: 'untilEndOfPhase',
                        match: this.hedgeKnight,
                        effect: effects.addTrait('Lord')
                    });
                    this.order.push(
                        this.hedgeKnight.hasTrait('Lord') ? 'late-applied' : 'late-expired'
                    );
                }
            });
            this.hedgeKnight.reaction({
                when: {
                    onPhaseEnded: (event) => event.phase === 'marshal'
                },
                handler: () => {
                    this.order.push(
                        this.hedgeKnight.hasTrait('Army') ? 'reaction-active' : 'reaction'
                    );
                }
            });
            this.hedgeKnight.abilities.reactions.forEach((ability) => ability.registerEvents());

            this.game.addEffect(this.hedgeKnight, {
                duration: 'untilEndOfPhase',
                match: this.hedgeKnight,
                effect: effects.addTrait('Army')
            });
        });

        it('expires until-the-end effects after interrupts and before reactions', function () {
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('Done');
            this.player1.triggerAbility(this.hedgeKnight);
            this.player1.triggerAbility(this.hedgeKnight);

            expect(this.hedgeKnight.hasTrait('Army')).toBe(false);
            expect(this.hedgeKnight.hasTrait('Lord')).toBe(false);
            expect(this.order).toEqual(['interrupt', 'late-expired', 'reaction']);
        });
    });

    describe('losing every trait', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: ['Hedge Knight']
                }
            });

            const existing = new Set(this.game.effectEngine.effects);
            this.game.addEffect(this.hedgeKnight, {
                match: this.hedgeKnight,
                effect: effects.losesAllTraits()
            });
            this.effect = this.game.effectEngine.effects.find((effect) => !existing.has(effect));
            this.hedgeKnight.addTrait('Army');
        });

        it('has none while the effect lasts, including a trait gained during it', function () {
            expect(this.hedgeKnight.hasTrait('Knight')).toBe(false);
            expect(this.hedgeKnight.hasTrait('Army')).toBe(false);

            const effect = this.effect;
            effect.cancel();
            this.game.effectEngine.effects = this.game.effectEngine.effects.filter(
                (candidate) => candidate !== effect
            );

            expect(this.hedgeKnight.hasTrait('Knight')).toBe(true);
            expect(this.hedgeKnight.hasTrait('Army')).toBe(true);
        });
    });

    describe('immunity', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    hand: ['Nightmares']
                },
                player2: {
                    inPlay: ['Stannis Baratheon (FotS)']
                }
            });

            this.game.addEffect(this.nightmares, {
                duration: 'untilEndOfPhase',
                match: (card) => card === this.stannisBaratheon,
                effect: effects.addTrait('Knight')
            });
        });

        it('stops an effect that names no game action', function () {
            expect(this.stannisBaratheon.hasTrait('Knight')).toBe(false);
        });
    });
});
