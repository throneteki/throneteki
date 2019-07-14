const Tokens = {
    bell: 'bell',
    betrayal: 'betrayal',
    blood: 'blood',
    ear: 'ear',
    gold: 'gold',
    kiss: 'kiss',
    poison: 'poison',
    shadow: 'shadow',
    stand: 'stand',
    valarmorghulis: 'valarmorghulis',
    vengeance: 'vengeance',
    venom: 'venom',
    includes: token => {
        return Object.values(Tokens).includes(token.toLowerCase());
    }
};

module.exports = Tokens;
