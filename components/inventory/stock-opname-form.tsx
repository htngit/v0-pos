"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { X, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface OpnameItem {
  id: string
  productId: string
  productName: string
  systemStock: number
  actualStock: number
  variance: number
}

interface StockOpnameFormProps {
  onClose: () => void
}

export default function StockOpnameForm({ onClose }: StockOpnameFormProps) {
  const [items, setItems] = useState<OpnameItem[]>([
    { id: "1", productId: "1", productName: "Bakso Sapi", systemStock: 15, actualStock: 14, variance: -1 },
    { id: "2", productId: "2", productName: "Es Teh", systemStock: 45, actualStock: 45, variance: 0 },
  ])
  const [notes, setNotes] = useState("")

  const handleUpdateItem = (id: string, field: string, value: any) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value }
          if (field === "actualStock") {
            updated.variance = updated.actualStock - updated.systemStock
          }
          return updated
        }
        return item
      }),
    )
  }

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Saving opname:", { items, notes })
    onClose()
  }

  const totalVariance = items.reduce((sum, item) => sum + item.variance, 0)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-border">
          <CardTitle>Stock Opname</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Opname Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Opname Date</label>
              <Input type="date" defaultValue={new Date().toISOString().split("T")[0]} />
            </div>

            {/* Items Table */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Stock Items</h3>

              <div className="overflow-x-auto border border-border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">System Stock</TableHead>
                      <TableHead className="text-right">Actual Stock</TableHead>
                      <TableHead className="text-right">Variance</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.productName}</TableCell>
                        <TableCell className="text-right">{item.systemStock}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.actualStock}
                            onChange={(e) => handleUpdateItem(item.id, "actualStock", Number(e.target.value))}
                            className="h-8 text-right"
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge
                            className={
                              item.variance > 0
                                ? "bg-green-100 text-green-800"
                                : item.variance < 0
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                            }
                          >
                            {item.variance > 0 ? "+" : ""}
                            {item.variance}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Summary */}
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                Total Variance:{" "}
                <span
                  className={`font-semibold ${totalVariance > 0 ? "text-green-600" : totalVariance < 0 ? "text-red-600" : "text-foreground"}`}
                >
                  {totalVariance > 0 ? "+" : ""}
                  {totalVariance}
                </span>
              </p>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about this opname..."
                className="w-full h-24 p-3 border border-border rounded-lg bg-background text-foreground"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2 justify-end pt-4 border-t border-border">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                Save Opname
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
