"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => {
  const listRef = React.useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = React.useState(false)
  const [startX, setStartX] = React.useState(0)
  const [scrollLeft, setScrollLeft] = React.useState(0)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!listRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - listRef.current.offsetLeft)
    setScrollLeft(listRef.current.scrollLeft)
    listRef.current.style.cursor = "grabbing"
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    if (listRef.current) listRef.current.style.cursor = "grab"
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !listRef.current) return
    e.preventDefault()
    const x = e.pageX - listRef.current.offsetLeft
    const walk = (x - startX) * 2
    listRef.current.scrollLeft = scrollLeft - walk
  }

  const handleMouseLeave = () => {
    if (isDragging) handleMouseUp()
  }

  React.useImperativeHandle(ref, () => listRef.current!)

  return (
    <TabsPrimitive.List
      ref={listRef}
      className={cn(
        "flex h-10 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground overflow-x-auto no-scrollbar w-full cursor-grab",
        className
      )}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    />
  )
})
TabsList.displayName = TabsPrimitive.List.displayName


const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm  flex-shrink-0",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
