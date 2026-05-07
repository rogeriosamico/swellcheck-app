import * as React from "react"
import { cn } from "@/lib/utils"

const Table = React.forwardRef(({ className, ...props }, ref) => (
  <div className="w-full overflow-x-auto">
    <table
      ref={ref}
      className={cn("w-full", className)}
      style={{ borderCollapse: 'collapse' }}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn(className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn(className)} {...props} />
))
TableBody.displayName = "TableBody"

const TableRow = React.forwardRef(({ className, style, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(className)}
    style={{ borderBottom: '1px solid var(--border-primary)', ...style }}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef(({ className, style, ...props }, ref) => (
  <th
    ref={ref}
    className={cn("text-left", className)}
    style={{
      padding: 'var(--spacing-sm) 0',
      fontSize: 'var(--font-size-subtitle)',
      color: 'var(--text-secondary)',
      fontWeight: 'var(--font-weight-bold)',
      fontFamily: 'var(--font-family)',
      ...style,
    }}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef(({ className, style, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("align-middle", className)}
    style={{
      padding: 'var(--spacing-sm) 0',
      fontSize: 'var(--font-size-body)',
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-family)',
      ...style,
    }}
    {...props}
  />
))
TableCell.displayName = "TableCell"

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell }
