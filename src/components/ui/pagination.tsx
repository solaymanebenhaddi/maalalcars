import * as React from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize?: number
  itemName?: string
  className?: string
  createPageUrl: (page: number) => string
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize = 9,
  itemName = 'véhicules',
  className,
  createPageUrl,
}: PaginationProps) {
  if (totalPages <= 1 && totalItems <= pageSize) {
    return null
  }

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = []
    const delta = 2 // Number of pages before and after current page

    const left = Math.max(1, currentPage - delta)
    const right = Math.min(totalPages, currentPage + delta)

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= left && i <= right)) {
        pages.push(i)
      } else if (pages[pages.length - 1] !== 'ellipsis') {
        pages.push('ellipsis')
      }
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-[#22222c] bg-[#111116] px-4 py-3 text-xs shadow-sm',
        className
      )}
    >
      {/* Range Info */}
      <div className="text-zinc-400 font-medium text-center sm:text-left">
        Affichage de <strong className="text-white font-mono">{startItem}</strong> à{' '}
        <strong className="text-white font-mono">{endItem}</strong> sur{' '}
        <strong className="text-red-400 font-mono font-bold">{totalItems}</strong> {itemName}
        <span className="hidden md:inline text-zinc-600 ml-2">
          • ({pageSize} par page)
        </span>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1.5 select-none">
        {/* First Page */}
        {totalPages > 4 && (
          <Link
            href={createPageUrl(1)}
            aria-disabled={currentPage === 1}
            tabIndex={currentPage === 1 ? -1 : undefined}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-lg border border-[#262634] bg-[#16161f] text-zinc-400 hover:text-white hover:bg-[#1f1f2a] transition-all',
              currentPage === 1 && 'pointer-events-none opacity-30 cursor-not-allowed'
            )}
            title="Première page"
          >
            <ChevronsLeft className="h-3.5 w-3.5" />
          </Link>
        )}

        {/* Previous Page */}
        <Link
          href={createPageUrl(Math.max(1, currentPage - 1))}
          aria-disabled={currentPage === 1}
          tabIndex={currentPage === 1 ? -1 : undefined}
          className={cn(
            'flex h-8 items-center gap-1 px-2.5 rounded-lg border border-[#262634] bg-[#16161f] text-xs font-semibold text-zinc-300 hover:text-white hover:bg-[#1f1f2a] transition-all',
            currentPage === 1 && 'pointer-events-none opacity-30 cursor-not-allowed'
          )}
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Précédent</span>
        </Link>

        {/* Numbered Pages */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((p, idx) => {
            if (p === 'ellipsis') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="flex h-8 w-6 items-center justify-center text-zinc-600 font-mono"
                >
                  …
                </span>
              )
            }

            const isActive = p === currentPage

            return (
              <Link
                key={p}
                href={createPageUrl(p)}
                className={cn(
                  'flex h-8 min-w-[32px] px-2 items-center justify-center rounded-lg text-xs font-mono font-bold transition-all',
                  isActive
                    ? 'bg-red-600 text-white shadow-lg shadow-red-950/50 border border-red-500 scale-105'
                    : 'border border-[#262634] bg-[#16161f] text-zinc-400 hover:text-white hover:bg-[#1f1f2a]'
                )}
              >
                {p}
              </Link>
            )
          })}
        </div>

        {/* Next Page */}
        <Link
          href={createPageUrl(Math.min(totalPages, currentPage + 1))}
          aria-disabled={currentPage === totalPages}
          tabIndex={currentPage === totalPages ? -1 : undefined}
          className={cn(
            'flex h-8 items-center gap-1 px-2.5 rounded-lg border border-[#262634] bg-[#16161f] text-xs font-semibold text-zinc-300 hover:text-white hover:bg-[#1f1f2a] transition-all',
            currentPage === totalPages && 'pointer-events-none opacity-30 cursor-not-allowed'
          )}
        >
          <span className="hidden sm:inline">Suivant</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>

        {/* Last Page */}
        {totalPages > 4 && (
          <Link
            href={createPageUrl(totalPages)}
            aria-disabled={currentPage === totalPages}
            tabIndex={currentPage === totalPages ? -1 : undefined}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-lg border border-[#262634] bg-[#16161f] text-zinc-400 hover:text-white hover:bg-[#1f1f2a] transition-all',
              currentPage === totalPages && 'pointer-events-none opacity-30 cursor-not-allowed'
            )}
            title="Dernière page"
          >
            <ChevronsRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
    </div>
  )
}
