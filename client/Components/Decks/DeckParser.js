export function lookupCardByName({ cardName, cards, packs }) {
    const pattern = /^([^()[\]]+)(\s+\((.+)\))?(\s+\[.+\])?$/;

    const match = cardName.trim().match(pattern);

    if (!match) {
        return;
    }

    const shortName = normaliseName(match[1]);
    let packName = match[3] && match[3].trim().toLowerCase();
    let pack =
        packName &&
        packs.find(
            (pack) => pack.code.toLowerCase() === packName || pack.name.toLowerCase() === packName
        );

    let matchingCards = cards.filter((card) => {
        if (pack) {
            return pack.code === card.packCode && normaliseName(card.name) === shortName;
        }

        return normaliseName(card.name) === shortName;
    });

    matchingCards.sort((a, b) => compareCardByReleaseDate(a, b, packs));

    return matchingCards[0];
}

// Other deck sites (CardgameDB) use typographic quotes, such as \u2019 for an apostrophe.
function normaliseName(name) {
    return name
        .trim()
        .replace(/[\u2018\u2019\u02bc]/g, "'")
        .replace(/[\u201c\u201d]/g, '"')
        .toLowerCase();
}

function compareCardByReleaseDate(a, b, packs) {
    let packA = packs.find((pack) => pack.code === a.packCode);
    let packB = packs.find((pack) => pack.code === b.packCode);

    if (!packA.releaseDate && packB.releaseDate) {
        return 1;
    }

    if (!packB.releaseDate && packA.releaseDate) {
        return -1;
    }

    return new Date(packA.releaseDate) < new Date(packB.releaseDate) ? -1 : 1;
}
