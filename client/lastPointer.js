// What the player last pressed with, so a tap can behave differently from a click
let lastPointerType = 'mouse';

if (typeof window !== 'undefined') {
    window.addEventListener(
        'pointerdown',
        (event) => {
            lastPointerType = event.pointerType || 'mouse';
        },
        { capture: true, passive: true }
    );
}

export const pressedByTouch = () => lastPointerType !== 'mouse';
