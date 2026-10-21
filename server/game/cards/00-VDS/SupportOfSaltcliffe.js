import DrawCard from '../../drawcard.js';

class SupportOfSaltcliffe extends DrawCard {
    // Support of Saltcliffe (00010)
    // [greyjoy] character only.
    // Attached character gains stealth.
    // Reaction: After you win an unopposed challenge in which attached character is attacking,
    // stand attached character.
    // Draft format only.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'greyjoy' });

        this.whileAttached({
            effect: ability.effects.addKeyword('stealth')
        });

        this.reaction({
            when: {
                afterChallenge: (event) =>
                    this.controller === event.challenge.winner &&
                    event.challenge.isParticipating(this.parent) &&
                    event.challenge.isUnopposed()
            },
            handler: () => {
                this.parent.controller.standCard(this.parent);
                this.game.addMessage(
                    '{0} uses {1} to stand {2}',
                    this.controller,
                    this,
                    this.parent
                );
            }
        });
    }
}

SupportOfSaltcliffe.code = '00010';

export default SupportOfSaltcliffe;
