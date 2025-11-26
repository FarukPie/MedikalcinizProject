"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const Accordion = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { type?: "single" | "multiple"; collapsible?: boolean }
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("space-y-1", className)} {...props} />
));
Accordion.displayName = "Accordion";

const AccordionItem = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("border-b", className)} {...props} />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(true); // Default open for this simple implementation

    return (
        <div className="flex">
            <button
                ref={ref}
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
                    className
                )}
                data-state={isOpen ? "open" : "closed"}
                {...props}
            >
                {children}
                <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
            </button>
        </div>
    );
});
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
    // In a real implementation with Context, we would check open state here.
    // For this simple version, we'll rely on the parent or just show it (limitation of custom simple accordion without context)
    // To make it properly collapsible without context, we need state.
    // Let's actually make a simple Context-based one to be correct.
    return (
        <div
            ref={ref}
            className={cn(
                "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
                className
            )}
            {...props}
        >
            <div className="pb-4 pt-0">{children}</div>
        </div>
    );
});
AccordionContent.displayName = "AccordionContent";

// Re-implementing with Context for proper state management
const AccordionContext = React.createContext<{
    openItems: string[];
    toggleItem: (value: string) => void;
}>({ openItems: [], toggleItem: () => { } });

const SimpleAccordion = ({
    type = "single",
    collapsible = false,
    defaultValue = [],
    className,
    children,
    ...props
}: {
    type?: "single" | "multiple";
    collapsible?: boolean;
    defaultValue?: string[];
    className?: string;
    children: React.ReactNode;
}) => {
    const [openItems, setOpenItems] = React.useState<string[]>(defaultValue);

    const toggleItem = (value: string) => {
        setOpenItems((prev) => {
            if (type === "single") {
                if (prev.includes(value)) {
                    return collapsible ? [] : prev;
                }
                return [value];
            } else {
                return prev.includes(value)
                    ? prev.filter((item) => item !== value)
                    : [...prev, value];
            }
        });
    };

    return (
        <AccordionContext.Provider value={{ openItems, toggleItem }}>
            <div className={cn("space-y-1", className)} {...props}>
                {children}
            </div>
        </AccordionContext.Provider>
    );
};

const SimpleAccordionItem = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, value, children, ...props }, ref) => (
    <div ref={ref} className={cn("border-b", className)} {...props}>
        {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
                return React.cloneElement(child as React.ReactElement<any>, { value });
            }
            return child;
        })}
    </div>
));
SimpleAccordionItem.displayName = "AccordionItem";

const SimpleAccordionTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement> & { value?: string }
>(({ className, children, value, ...props }, ref) => {
    const { openItems, toggleItem } = React.useContext(AccordionContext);
    const isOpen = value ? openItems.includes(value) : false;

    return (
        <div className="flex">
            <button
                ref={ref}
                onClick={() => value && toggleItem(value)}
                className={cn(
                    "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
                    className
                )}
                data-state={isOpen ? "open" : "closed"}
                {...props}
            >
                {children}
                <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
            </button>
        </div>
    );
});
SimpleAccordionTrigger.displayName = "AccordionTrigger";

const SimpleAccordionContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { value?: string }
>(({ className, children, value, ...props }, ref) => {
    const { openItems } = React.useContext(AccordionContext);
    const isOpen = value ? openItems.includes(value) : false;

    if (!isOpen) return null;

    return (
        <div
            ref={ref}
            className={cn(
                "overflow-hidden text-sm transition-all animate-in fade-in slide-in-from-top-2",
                className
            )}
            {...props}
        >
            <div className="pb-4 pt-0">{children}</div>
        </div>
    );
});
SimpleAccordionContent.displayName = "AccordionContent";

export { SimpleAccordion as Accordion, SimpleAccordionItem as AccordionItem, SimpleAccordionTrigger as AccordionTrigger, SimpleAccordionContent as AccordionContent };
