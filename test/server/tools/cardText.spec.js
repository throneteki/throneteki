import { cardTextProblems, commentFor, withComment } from '../../tools/cardText.js';

describe('card text comments', function () {
    it('match the card data in every card implementation', function () {
        expect(cardTextProblems()).toEqual([]);
    });

    it('replace an out-of-date comment rather than adding another', function () {
        const source = [
            'class Example extends DrawCard {',
            '    // Example (00001)',
            '    // Old text.',
            '    setupCardAbilities() {}',
            '}'
        ].join('\n');
        const comment = commentFor([
            { code: '00001', name: 'Example', text: '<b>Action:</b> New text.' }
        ]);

        expect(withComment(source, comment)).toBe(
            [
                'class Example extends DrawCard {',
                '    // Example (00001)',
                '    // Action: New text.',
                '    setupCardAbilities() {}',
                '}'
            ].join('\n')
        );
    });

    it('replaces Windows line-ending comments once and preserves their line endings', function () {
        const source =
            'class Example extends DrawCard {\r\n    // Example (00001)\r\n    // Old text.\r\n    setupCardAbilities() {}\r\n}';
        const comment = commentFor([{ code: '00001', name: 'Example', text: 'New text.' }]);
        const updated = withComment(source, comment);
        expect(updated.match(/Example \(00001\)/g)).toHaveLength(1);
        expect(updated).toContain('// New text.\r\n');
        expect(withComment(updated, comment)).toBe(updated);
    });
});
