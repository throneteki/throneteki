import { Button, extendVariants } from '@heroui/react';

export const SmallButton = extendVariants(Button, {
    variants: {
        size: {
            xs: 'px-2 min-w-8 h-8 text-small gap-unit-1 border'
        }
    }
});
