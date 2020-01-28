export function deckStatusLabel(status) {
    if(!status.basicRules) {
        return 'Invalid';
    }
    const category = status.noBannedCards ? 'Tournament' : 'Premium';

    if(!status.faqJoustRules || !status.noUnreleasedCards) {
        return `${category} (Casual)`;
    }

    return `${category} (Legal)`;
}
