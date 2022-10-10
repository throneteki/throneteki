const Tokens = {
    bell: 'bell',
    betrayal: 'betrayal',
    blood: 'blood',
    ear: 'ear',
    gold: 'gold',
    ghost: 'ghost',
    jail: 'jail',
    journey: 'journey',
    kiss: 'kiss',
    poison: 'poison',
    prayer: 'prayer',
    shadow: 'shadow',
    stand: 'stand',
    valarmorghulis: 'valarmorghulis',
    vengeance: 'vengeance',
    venom: 'venom',
    tale: 'tale',
    list: () => {
        return Object.values(Tokens).filter(token => typeof token !== 'function');
    },
    includes: token => {
        return Object.values(Tokens).includes(token.toLowerCase());
    }
};

module.exports = Tokens;
