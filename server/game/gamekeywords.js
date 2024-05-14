const AssaultKeyword = require('./assaultkeyword.js');
const InsightKeyword = require('./insightkeyword.js');
const IntimidateKeyword = require('./intimidatekeyword.js');
const PillageKeyword = require('./pillagekeyword.js');
const RenownKeyword = require('./renownkeyword.js');
const StealthKeyword = require('./stealthkeyword.js');

const GameKeywords = {
    assault: new AssaultKeyword(),
    insight: new InsightKeyword(),
    intimidate: new IntimidateKeyword(),
    pillage: new PillageKeyword(),
    renown: new RenownKeyword(),
    stealth: new StealthKeyword()
};

module.exports = GameKeywords;
