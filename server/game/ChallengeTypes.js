class ChallengeTypes {
    static asButtons(propertiesOrFunc) {
        return ChallengeTypes.all.map((type) => {
            let resolvedProperties =
                typeof propertiesOrFunc === 'function'
                    ? propertiesOrFunc(type.value)
                    : propertiesOrFunc;
            return Object.assign(
                { text: type.text, arg: type.value, icon: type.icon },
                resolvedProperties
            );
        });
    }
}

ChallengeTypes.all = [
    { text: 'Military', value: 'military', icon: 'military' },
    { text: 'Intrigue', value: 'intrigue', icon: 'intrigue' },
    { text: 'Power', value: 'power', icon: 'power' }
];

export default ChallengeTypes;
