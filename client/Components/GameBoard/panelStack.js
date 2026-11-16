// Open panels, the last one used on top. Kept low, so cards being carried or flying stay above every panel.
const stack = [];
const base = 1;

const restack = () => stack.forEach((panel, index) => (panel.style.zIndex = String(base + index)));

export const raisePanel = (panel) => {
    const index = stack.indexOf(panel);
    if (index === stack.length - 1 && index !== -1) {
        return;
    }
    if (index !== -1) {
        stack.splice(index, 1);
    }
    stack.push(panel);
    restack();
};

export const dropPanel = (panel) => {
    const index = stack.indexOf(panel);
    if (index !== -1) {
        stack.splice(index, 1);
        restack();
    }
};
