"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download } from "lucide-react"

interface SalesItem {
  id: string
  productName: string
  category: string
  quantitySold: number
  revenue: number
  avgPrice: number
}

const mockSalesData: SalesItem[] = [
  {
    id: "1",
    productName: "Bakso Sapi",
    category: "Food",
    quantitySold: 45,
    revenue: 1125000,
    avgPrice: 25000,
  },
  {
    id: "2",
    productName: "Es Teh",
    category: "Beverage",
    quantitySold: 120,
    revenue: 600000,
    avgPrice: 5000,
  },
  {
    id: "3",
    productName: "Nasi Goreng",
    category: "Food",
    quantitySold: 32,
    revenue: 960000,
    avgPrice: 30000,
  },
  {
    id: "4",
    productName: "Kopi Hitam",
    category: "Beverage",
    quantitySold: 85,
    revenue: 680000,
    avgPrice: 8000,
  },
]

export default function SalesReport() {
  const [startDate, setStartDate] = useState("2025-10-01")
  const [endDate, setEndDate] = useState("2025-10-26")

  const totalQuantity = mockSalesData.reduce((sum, item) => sum + item.quantitySold, 0)
  const totalRevenue = mockSalesData.reduce((sum, item) => sum + item.revenue, 0)
  const topProduct = mockSalesData.reduce((max, item) => (item.revenue > max.revenue ? item : max))

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Start Date</label>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">End Date</label>
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Items Sold</p>
          <p className="text-2xl font-bold text-foreground">{totalQuantity}</p>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-primary">Rp {totalRevenue.toLocaleString("id-ID")}</p>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">Top Product</p>
          <p className="text-lg font-bold text-foreground">{topProduct.productName}</p>
          <p className="text-xs text-muted-foreground mt-1">Rp {topProduct.revenue.toLocaleString("id-ID")}</p>
        </Card>
      </div>

      {/* Sales Table */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Product Sales</h3>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Quantity Sold</TableHead>
                <TableHead className="text-right">Avg Price</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockSalesData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.productName}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{item.category}</TableCell>
                  <TableCell className="text-right">{item.quantitySold}</TableCell>
                  <TableCell className="text-right">Rp {item.avgPrice.toLocaleString("id-ID")}</TableCell>
                  <TableCell className="text-right font-medium">Rp {item.revenue.toLocaleString("id-ID")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
