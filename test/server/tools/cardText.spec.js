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
});
