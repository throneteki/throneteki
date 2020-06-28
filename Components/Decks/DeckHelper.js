export function deckStatusLabel(status) {
    if(!status.basicRules) {
        return 'Invalid';
    }

    if(!status.noBannedCards) {
        return 'Banned';
    }

    if(!status.faqJoustRules || !status.noUnreleasedCards) {
        return 'Casual';
    }

    return 'Legal';
}
