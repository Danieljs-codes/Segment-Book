"use client"

import React from "react"

import { DropZone as DropPrimitiveZone, type DropZoneProps } from "react-aria-components"
import { tv } from "tailwind-variants"

import { cr, focusStyles } from "./primitive"

const dropZoneStyles = tv({
  extend: focusStyles,
  base: "group has-[slot=description]:text-center flex max-h-[200px] p-6 max-w-xl flex-col items-center justify-center gap-2 rounded-md border border-dashed text-sm",
  variants: {
    isDropTarget: {
      true: "bg-primary/10 ring-4 ring-primary/20 [&_.text-muted-fg]:text-primary-fg border-solid border-primary"
    }
  }
})

const DropZone = ({ className, ...props }: DropZoneProps) => (
  <DropPrimitiveZone
    className={cr(className, (className, renderProps) =>
      dropZoneStyles({ ...renderProps, className })
    )}
    {...props}
  />
)
export { DropZone }
