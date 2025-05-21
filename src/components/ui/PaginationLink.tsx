import * as React from "react"
import { ButtonProps, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

console.log('[pagination] PaginationLink componente executado');

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"a">

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size,
      }),
      className
    )}
    {...props}
  />
)
PaginationLink.displayName = "PaginationLink"

export { PaginationLink, type PaginationLinkProps } 