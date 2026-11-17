export const ProfileSections = [
    {
        key: 'account',
        label: 'Account',
        description: 'Your email address and password.',
        fields: ['email', 'emailUpdates', 'currentPassword', 'password', 'passwordAgain']
    },
    {
        key: 'integrations',
        label: 'Integrations',
        description: 'Your avatar and Patreon account.',
        fields: ['enableGravatar']
    },
    {
        key: 'gameplay',
        label: 'Gameplay',
        description: 'When the game asks you to act, and what it does for you.',
        fields: [
            'actionWindows',
            'chooseOrder',
            'chooseCards',
            'promptDupes',
            'hideInterrupts',
            'hideReactions',
            'keyboardShortcuts'
        ]
    },
    {
        key: 'appearance',
        label: 'Appearance',
        description: 'Card size and the game board background.',
        fields: ['cardSize', 'background']
    }
];

export const isProfileSection = (key) => ProfileSections.some((section) => section.key === key);

export const getProfileSection = (key) =>
    ProfileSections.find((section) => section.key === key) || ProfileSections[0];

export const sectionsWithFields = (fieldNames) =>
    ProfileSections.filter((section) =>
        section.fields.some((field) => fieldNames.includes(field))
    ).map((section) => section.key);
