class ChallengeTypes {
    static asButtons(propertiesOrFunc) {
        return ChallengeTypes.all.map(type => {
            let resolvedProperties = typeof propertiesOrFunc === 'function' ? propertiesOrFunc(type.value) : propertiesOrFunc;
            return Object.assign({ text: type.text, arg: type.value }, resolvedProperties);
        });
    }
}

ChallengeTypes.all = [
    { text: 'Military', value: 'military' },
    { text: 'Intrigue', value: 'intrigue' },
    { text: 'Power', value: 'power' }
];

module.exports = ChallengeTypes;
