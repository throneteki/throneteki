import AssaultKeyword from './assaultkeyword.js';
import InsightKeyword from './insightkeyword.js';
import IntimidateKeyword from './intimidatekeyword.js';
import PillageKeyword from './pillagekeyword.js';
import RenownKeyword from './renownkeyword.js';
import StealthKeyword from './stealthkeyword.js';

const GameKeywords = {
    assault: new AssaultKeyword(),
    insight: new InsightKeyword(),
    intimidate: new IntimidateKeyword(),
    pillage: new PillageKeyword(),
    renown: new RenownKeyword(),
    stealth: new StealthKeyword()
};

export default GameKeywords;
