const DrawCard = require('../../drawcard.js');

class TheBalerion extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => !this.isConverted && card.name === 'Captain Groleo' && card.controller === this.controller,
            effect: [
                ability.effects.addTrait('Commander'),
                ability.effects.addIcon('power')
            ]
        });
        this.persistentEffect({
            condition: () => this.isConverted && this.game.isDuringChallenge({ challengeType: 'power' }),
            match: card => card === this.parent,
            effect: [
                ability.effects.addKeyword('assault')
            ]
        });
        this.action({
            title: 'Kneel and attach to a character',
            cost: ability.costs.kneelSelf(),
            target: {
                title: 'Select a character',
                cardCondition: card => card.isMatch({ trait: ['Army', 'Stormborn'], controller: this.controller } && this.isCardEligibleToHaveWeaponAttachments(card))
            },
            phase: 'challenge',
            message: '{player} kneels {source} to attach it to {target} as a Weapon attachment, with it gaining assault during power challenges',
            handler: context => {
                context.player.attach(context.player, this, context.target, 'play', false);

                this.lastingEffect(ability => ({
                    targetLocation: 'any',
                    match: this,
                    effect: [
                        ability.effects.setCardType('attachment'),
                        ability.effects.addKeyword('Terminal'),
                        ability.effects.addTrait('Weapon')
                    ]
                }));

                this.isConverted = true;
            } 
        });
    }
    isCardEligibleToHaveWeaponAttachments(card) {
        let noAttachmentKeywords = card.getKeywords().filter(keyword => keyword.startsWith('no attachments'));
        return noAttachmentKeywords.length === 0 || 
            (noAttachmentKeywords.length === 1 && noAttachmentKeywords[0] === 'no attachments except <i>weapon</i>');
    }
}

TheBalerion.code = '23014';

module.exports = TheBalerion;
