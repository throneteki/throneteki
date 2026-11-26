import { describe, expect, it } from 'vitest';
import { activePlayerOf, followTarget } from '../../client/Components/GameBoard/Adaptive/followTarget';

const player = (name, seatNo, { active = false, selectable = [] } = {}) => ({
    name,
    seatNo,
    user: { username: name },
    isActivePrompt: active,
    cardPiles: {
        cardsInPlay: [
            { uuid: `${name}-1`, selectable: selectable.includes(1) },
            {
                uuid: `${name}-2`,
                attachments: [{ uuid: `${name}-2a`, selectable: selectable.includes(2) }]
            }
        ]
    }
});

describe('followTarget', () => {
    it('follows the first opponent round the table with a card we can choose during our prompt', () => {
        const me = player('me', 1, { active: true });
        const others = [
            player('two', 2, { selectable: [1] }),
            player('three', 3),
            player('four', 4, { selectable: [1] })
        ];
        expect(followTarget(me, others)).toBe('four');
    });

    it('counts an attachment we can choose as a card on that board', () => {
        const me = player('me', 1, { active: true });
        const others = [player('two', 2, { selectable: [2] }), player('three', 3)];
        expect(followTarget(me, others)).toBe('two');
    });

    it('follows our own board during our prompt when no opponent has a card we can choose', () => {
        const me = player('me', 1, { active: true, selectable: [1] });
        const others = [player('two', 2), player('three', 3)];
        expect(followTarget(me, others)).toBe('me');
    });

    it("follows the opponent whose prompt is active when it isn't ours", () => {
        const me = player('me', 1);
        const others = [player('two', 2), player('three', 3, { active: true })];
        expect(followTarget(me, others)).toBe('three');
    });

    it('stays where it is when no prompt is active', () => {
        const me = player('me', 1);
        const others = [player('two', 2), player('three', 3)];
        expect(followTarget(me, others)).toBeNull();
    });

    it('stays where it is with no player to follow from', () => {
        expect(followTarget(undefined, [player('two', 2)])).toBeNull();
    });
});

describe('activePlayerOf', () => {
    it('names whoever has the active prompt, us included', () => {
        expect(activePlayerOf(player('me', 1, { active: true }), [player('two', 2)])).toBe('me');
        expect(activePlayerOf(player('me', 1), [player('two', 2, { active: true })])).toBe('two');
        expect(activePlayerOf(player('me', 1), [player('two', 2)])).toBeNull();
    });
});
