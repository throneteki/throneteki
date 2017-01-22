const DrawCard = require('../../../drawcard.js');

class ObaraSand extends DrawCard {
	isKneeled() {
		if(challenge.defendingPlayer == this.controller && challenge.challengeType == 'power' && !this.isBlank()) {
			return false;
		}
		return this.kneeled;
	}
}

ObaraSand.code = '01108';

module.exports = ObaraSand;