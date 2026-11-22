export const MaxDescriptionLength = 2000;
export const MaxDeleteCount = 50;

export function normaliseDescription(description) {
    return typeof description === 'string' ? description.trim().slice(0, MaxDescriptionLength) : '';
}
