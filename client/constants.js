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
    FactionColorMaps: {
        baratheon: 'text-baratheon',
        greyjoy: 'text-greyjoy',
        lannister: 'text-lannister',
        martell: 'text-martell',
        neutral: 'text-neutral',
        stark: 'text-startl',
        targaryen: 'text-targaryen',
        thenightswatch: 'text-thenightswatch',
        tyrell: 'text-tyrell'
    },
    CardTypes: [
        { name: 'Title', value: 'title' },
        { name: 'Agenda', value: 'agenda' },
        { name: 'Plot', value: 'plot' },
        { name: 'Character', value: 'character' },
        { name: 'Attachment', value: 'attachment' },
        { name: 'Location', value: 'location' },
        { name: 'Event', value: 'event' }
    ]
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

export const cardSizes = {
    sm: [2.4, 3.36], // * 0.6
    md: [4, 5.6], // * 1
    lg: [5.6, 7.84], // * 1.4
    xl: [8, 11.2], // * 2
    '2xl': [12, 16.8], // * 3
    '3xl': [16, 22.4], // * 4
    '4xl': [20, 28] // * 5
};
