// A ring's animation starts when its class is added, so each is put on the page's clock to breathe in step
const inStep = new Set(['ring-breathe', 'ring-danger']);

export const keepPulsesInStep = () =>
    document.addEventListener('animationstart', ({ target, animationName }) => {
        if (!inStep.has(animationName)) {
            return;
        }
        const animation = target
            .getAnimations()
            .find((each) => each.animationName === animationName);
        if (animation) {
            animation.startTime = 0;
        }
    });
