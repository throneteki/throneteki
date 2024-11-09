export const ItemTypes = {
    CARD: 'card',
    PANEL: 'panel'
};

export const ThronesIcons = [
    'military',
    'power',
    'intrigue',
    'stark',
    'baratheon',
    'tyrell',
    'martell',
    'lannister',
    'thenightswatch',
    'targaryen',
    'greyjoy'
];

export const Constants = {
    Factions: [
        { name: 'House Baratheon', value: 'baratheon' },
        { name: 'House Greyjoy', value: 'greyjoy' },
        { name: 'House Lannister', value: 'lannister' },
        { name: 'House Martell', value: 'martell' },
        { name: "The Night's Watch", value: 'thenightswatch' },
        { name: 'House Stark', value: 'stark' },
        { name: 'House Targaryen', value: 'targaryen' },
        { name: 'House Tyrell', value: 'tyrell' }
    ],
    Stats: ['gold', 'totalPower', 'initiative', 'claim', 'reserve'],
    FactionsImagePaths: {},
    StatIconImagePaths: {},
    ColourClassByRole: {
        admin: 'text-red-500',
        contributor: 'text-blue-400',
        supporter: 'text-green-500',
        winner: 'text-yellow-200',
        previouswinner: 'text-pink-500'
    },
    Icons: {
        military: new URL(`./assets/img/icons/military.png`, import.meta.url).href,
        intrigue: new URL(`./assets/img/icons/intrigue.png`, import.meta.url).href,
        power: new URL(`./assets/img/icons/power.png`, import.meta.url).href
    }
};

for (const faction of Object.values(Constants.Factions)) {
    Constants.FactionsImagePaths[faction.value] = new URL(
        `./assets/img/factions/${faction.value}.png`,
        import.meta.url
    ).href;
}

for (const stat of Constants.Stats) {
    Constants.StatIconImagePaths[stat] = new URL(
        `./assets/img/stats/${stat}.png`,
        import.meta.url
    ).href;
}

export const BannersForFaction = {
    '01198': 'baratheon',
    '01199': 'greyjoy',
    '01200': 'lannister',
    '01201': 'martell',
    '01202': 'thenightswatch',
    '01203': 'stark',
    '01204': 'targaryen',
    '01205': 'tyrell'
};
