'use client';

import * as React from 'react';
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import { AnimatePresence, motion } from 'motion/react';

const Collapsible = CollapsiblePrimitive.Root;

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;

const AnimatedCollapsibleContent = React.forwardRef(({ children, ...props }, ref) => {
    const isOpen = props['data-state'] === 'open';
    return (
        <motion.div
            ref={ref}
            initial={false}
            animate={isOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
            {...props}
        >
            {children}
        </motion.div>
    );
});
AnimatedCollapsibleContent.displayName = 'AnimatedCollapsibleContent';

const CollapsibleContent = React.forwardRef(
    ({ children, ...props }, ref) => {
        return (
            <CollapsiblePrimitive.CollapsibleContent forceMount asChild {...props}>
                <AnimatedCollapsibleContent ref={ref}>{children}</AnimatedCollapsibleContent>
            </CollapsiblePrimitive.CollapsibleContent>
        );
    }
);
CollapsibleContent.displayName =
    CollapsiblePrimitive.CollapsibleContent.displayName;

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
