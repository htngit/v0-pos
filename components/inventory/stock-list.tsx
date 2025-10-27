"use client"

import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, AlertTriangle } from "lucide-react"
import { useState } from "react"

interface StockItem {
  id: string
  name: string
  sku: string
  category: string
  currentStock: number
  minStock: number
  unit: string
  lastUpdated: string
  image: string
}

const mockStockItems: StockItem[] = [
  {
    id: "1",
    name: "Bakso Sapi",
    sku: "BSP-001",
    category: "Food",
    currentStock: 15,
    minStock: 10,
    unit: "porsi",
    lastUpdated: "2 hours ago",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: "2",
    name: "Daging Sapi",
    sku: "DSP-001",
    category: "Raw Material",
    currentStock: 200,
    minStock: 500,
    unit: "gram",
    lastUpdated: "1 day ago",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: "3",
    name: "Es Teh",
    sku: "EST-001",
    category: "Beverage",
    currentStock: 45,
    minStock: 20,
    unit: "gelas",
    lastUpdated: "30 mins ago",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: "4",
    name: "Gula Pasir",
    sku: "GLP-001",
    category: "Raw Material",
    currentStock: 5,
    minStock: 50,
    unit: "kg",
    lastUpdated: "3 days ago",
    image: "/placeholder.svg?height=50&width=50",
  },
]

export default function StockList() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredItems = mockStockItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getStockStatus = (current: number, min: number) => {
    if (current <= min) return { color: "bg-red-100 text-red-800", label: "Low Stock" }
    if (current <= min * 1.5) return { color: "bg-yellow-100 text-yellow-800", label: "Warning" }
    return { color: "bg-green-100 text-green-800", label: "OK" }
  }

  return (
    <Card className="p-4">
      {/* Search */}
      <div className="mb-4 flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead className="text-right">Current Stock</TableHead>
              <TableHead className="text-right">Min Stock</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.map((item) => {
              const status = getStockStatus(item.currentStock, item.minStock)
              return (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.category}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{item.sku}</TableCell>
                  <TableCell className="text-right font-medium">{item.currentStock}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{item.minStock}</TableCell>
                  <TableCell className="text-sm">{item.unit}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {item.currentStock <= item.minStock && <AlertTriangle className="w-4 h-4 text-red-600" />}
                      <Badge className={status.color}>{status.label}</Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">{item.lastUpdated}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No stock items found</p>
        </div>
      )}
    </Card>
  )
}
