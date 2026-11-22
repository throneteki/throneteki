import { toBlob } from 'html-to-image';
import { downloadBlob } from '../../util';

// Instagram/TikTok story size
const ShareWidth = 1080;

export const renderCard = (node) =>
    toBlob(node, {
        pixelRatio: ShareWidth / node.offsetWidth,
        // Square corners, so the image has no transparent edges on a story
        style: { borderRadius: '0', boxShadow: 'none' },
        filter: (element) => !(element instanceof HTMLElement && 'shareExclude' in element.dataset)
    });

export const shareImage = async (blob, fileName, title) => {
    const file = new File([blob], fileName, { type: 'image/png' });
    const isTouch = window.matchMedia?.('(pointer: coarse)').matches;

    if (isTouch && navigator.canShare?.({ files: [file] })) {
        try {
            await navigator.share({ files: [file], title });
            return 'shared';
        } catch (error) {
            if (error.name === 'AbortError') {
                return 'cancelled';
            }

            // e.g. NotAllowedError when the browser decides too long has passed since the tap; download instead
        }
    }

    downloadBlob(blob, fileName);

    return 'downloaded';
};
