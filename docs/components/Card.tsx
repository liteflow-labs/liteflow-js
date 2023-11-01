import cn from 'clsx'
import NextLink from 'next/link'
import type { ReactNode } from 'react'

const classes = {
  card: cn(
    'nextra-card nx-group nx-flex nx-flex-col nx-justify-start nx-overflow-hidden nx-rounded-lg nx-border nx-border-gray-200',
    'nx-text-current nx-no-underline dark:nx-shadow-none',
    'hover:nx-shadow-gray-100 dark:hover:nx-shadow-none nx-shadow-gray-100',
    'active:nx-shadow-sm active:nx-shadow-gray-200',
    'nx-transition-all nx-duration-200 hover:nx-border-gray-300',
  ),
  title: cn(
    'nx-flex nx-font-semibold nx-items-start nx-gap-2 nx-p-4 nx-text-gray-700 hover:nx-text-gray-900',
  ),
}

export function Card({
  children,
  title,
  icon,
  arrow,
  href,
  ...props
}: {
  children: ReactNode
  title: string
  icon: ReactNode
  arrow?: boolean
  href: string
}) {
  return (
    <NextLink
      href={href}
      className={cn(
        classes.card,
        'nx-shadow-sm dark:nx-border-neutral-800 hover:nx-bg-slate-50 hover:nx-shadow-md dark:hover:nx-border-neutral-700 dark:hover:nx-bg-neutral-900',
      )}
      {...props}
    >
      {title && (
        <span
          className={cn(
            classes.title,
            'dark:nx-text-neutral-200 dark:hover:nx-text-neutral-50 nx-flex nx-items-center',
          )}
        >
          {icon}
          {title}
          {arrow && (
            <span className="nx-transition-transform nx-duration-75 group-hover:nx-translate-x-[2px]">
              →
            </span>
          )}
        </span>
      )}
      {children && <div className="nx-px-4 nx-pb-4">{children}</div>}
    </NextLink>
  )
}
