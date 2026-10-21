import DrawCard from '../../drawcard.js';

class TheWardenOfTheNorth extends DrawCard {
    // The Warden of the North (26012)
    // [stark] Lord character only.
    // Attached character gains the Commander trait and renown.
    // While attached character is participating in a challenge, each player cannot play events or
    // bring cards out of shadows.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'stark', trait: 'Lord' });

        this.whileAttached({
            effect: [ability.effects.addTrait('Commander'), ability.effects.addKeyword('Renown')]
        });

        this.persistentEffect({
            condition: (context) =>
                !!context.source.parent && context.source.parent.isParticipating(),
            targetController: 'any',
            effect: [
                ability.effects.cannotPutIntoPlay((card) => card.location === 'shadows'),
                ability.effects.cannotPlay((card) => card.getPrintedType() === 'event')
            ]
        });
    }
}

TheWardenOfTheNorth.code = '26012';

export default TheWardenOfTheNorth;
