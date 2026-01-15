"use client";

import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import type { Id } from "../../convex/_generated/dataModel";
import { Badge } from "../tailwind/ui/badge";
import { Button } from "../tailwind/ui/button";
import { Input } from "../tailwind/ui/input";
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown,
  Search,
} from "lucide-react";

type DealStage = "sourcing" | "due-diligence" | "negotiation" | "closing" | "closed-won" | "closed-lost";
type Priority = "high" | "medium" | "low";

interface Deal {
  _id: Id<"colab_deals">;
  company: string;
  stage: DealStage;
  valuation?: string;
  lead?: string;
  createdAt: number;
  updatedAt: number;
  dueDate?: number;
  priority?: Priority;
  tags?: string[];
}

interface TableViewProps {
  deals: Deal[];
  onDealClick?: (dealId: Id<"colab_deals">) => void;
}

const stageColors: Record<DealStage, string> = {
  sourcing: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  "due-diligence": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
  negotiation: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100",
  closing: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
  "closed-won": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  "closed-lost": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
};

const priorityColors: Record<Priority, string> = {
  high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
  low: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100",
};

const columnHelper = createColumnHelper<Deal>();

export function TableView({ deals, onDealClick }: TableViewProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = useMemo(() => [
    columnHelper.accessor("company", {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1 -ml-4"
        >
          Company
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="h-4 w-4" />
          ) : (
            <ArrowUpDown className="h-4 w-4" />
          )}
        </Button>
      ),
      cell: (info) => (
        <span className="font-medium">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("stage", {
      header: "Stage",
      cell: (info) => (
        <Badge className={stageColors[info.getValue()]}>
          {info.getValue().replace("-", " ")}
        </Badge>
      ),
    }),
    columnHelper.accessor("valuation", {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1 -ml-4"
        >
          Valuation
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
      cell: (info) => info.getValue() || "—",
    }),
    columnHelper.accessor("lead", {
      header: "Lead",
      cell: (info) => info.getValue() || "—",
    }),
    columnHelper.accessor("priority", {
      header: "Priority",
      cell: (info) => {
        const priority = info.getValue();
        if (!priority) return "—";
        return (
          <Badge className={priorityColors[priority]}>
            {priority}
          </Badge>
        );
      },
    }),
    columnHelper.accessor("dueDate", {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1 -ml-4"
        >
          Due Date
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
      cell: (info) => {
        const date = info.getValue();
        if (!date) return "—";
        return new Date(date).toLocaleDateString();
      },
    }),
    columnHelper.accessor("createdAt", {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1 -ml-4"
        >
          Created
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    }),
    columnHelper.accessor("tags", {
      header: "Tags",
      cell: (info) => {
        const tags = info.getValue();
        if (!tags || tags.length === 0) return "—";
        return (
          <div className="flex gap-1 flex-wrap">
            {tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{tags.length - 3}
              </Badge>
            )}
          </div>
        );
      },
    }),
  ], []);

  const table = useReactTable({
    data: deals,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search deals..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <table className="w-full">
          <thead className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-sm font-medium text-muted-foreground"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No deals found
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-t hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => onDealClick?.(row.original._id)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 text-sm">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="text-sm text-muted-foreground">
        {table.getFilteredRowModel().rows.length} deal(s)
      </div>
    </div>
  );
}
