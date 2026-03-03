import * as React from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { motion } from 'motion/react'
import { ChevronDown } from 'lucide-react'

import { cn } from '@/lib/utils'

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn('border-b', className)}
    {...props}
  />
))
AccordionItem.displayName = 'AccordionItem'

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline group',
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown
        className="h-4 w-4 shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-data-[state=open]:rotate-180"
        data-accordion-chevron
      />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Sync with Radix AccordionItem's data-state
  React.useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Find the parent AccordionItem
    const accordionItem = container.closest('[data-state]')
    if (!accordionItem) return

    const updateState = () => {
      const state = accordionItem.getAttribute('data-state')
      setIsOpen(state === 'open')
    }

    // Initial state
    updateState()

    // Watch for changes
    const observer = new MutationObserver(updateState)
    observer.observe(accordionItem, {
      attributes: true,
      attributeFilter: ['data-state'],
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef}>
      <motion.div
        ref={ref}
        initial={false}
        animate={{
          height: isOpen ? 'auto' : 0,
        }}
        transition={{
          duration: 0.3,
          ease: [0.32, 0.72, 0, 1],
        }}
        className="overflow-hidden"
        {...props}
      >
        <div className={cn('pb-4 pt-0 text-sm', className)}>{children}</div>
      </motion.div>
    </div>
  )
})

AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
