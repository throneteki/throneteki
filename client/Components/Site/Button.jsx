import React, { forwardRef, useCallback } from 'react';
import { Button as HeroButton } from '@heroui/react';

// HeroUI's Button (React Aria) drops the title attribute, so it is set on the element here. An icon-only button is
// also named by its title when it has no label of its own.
const Button = forwardRef(function Button({ title, ...props }, ref) {
    const setRef = useCallback(
        (node) => {
            if (node) {
                if (title) {
                    node.title = title;
                } else {
                    node.removeAttribute('title');
                }
            }
            if (typeof ref === 'function') {
                ref(node);
            } else if (ref) {
                ref.current = node;
            }
        },
        [ref, title]
    );

    return (
        <HeroButton
            {...props}
            ref={setRef}
            aria-label={props['aria-label'] ?? (props.isIconOnly ? title : undefined)}
        />
    );
});

export default Button;
