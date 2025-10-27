"use client"

import { useState } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Search } from "lucide-react"

interface Product {
  id: string
  name: string
  sku: string
  category: string
  type: "finish_goods" | "recipe_goods" | "raw_material"
  price: number
  cost: number
  stock: number
  image: string
}

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Bakso Sapi",
    sku: "BSP-001",
    category: "Food",
    type: "finish_goods",
    price: 25000,
    cost: 12000,
    stock: 15,
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: "2",
    name: "Daging Sapi",
    sku: "DSP-001",
    category: "Raw Material",
    type: "raw_material",
    price: 80000,
    cost: 75000,
    stock: 5000,
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: "3",
    name: "Es Teh",
    sku: "EST-001",
    category: "Beverage",
    type: "finish_goods",
    price: 5000,
    cost: 2000,
    stock: 45,
    image: "/placeholder.svg?height=50&width=50",
  },
]

interface ProductListProps {
  onEdit: (product: Product) => void
}

export default function ProductList({ onEdit }: ProductListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || product.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const getTypeColor = (type: string) => {
    switch (type) {
      case "finish_goods":
        return "bg-blue-100 text-blue-800"
      case "recipe_goods":
        return "bg-purple-100 text-purple-800"
      case "raw_material":
        return "bg-amber-100 text-amber-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStockColor = (stock: number) => {
    if (stock > 20) return "text-green-600"
    if (stock > 10) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <Card className="p-0 border-0">
      {/* Search */}
      <div className="p-3 border-b border-border bg-card">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-8 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/50 sticky top-0">
            <TableRow className="hover:bg-transparent border-b border-border">
              <TableHead className="h-8 px-3 py-1 text-xs font-semibold">Product</TableHead>
              <TableHead className="h-8 px-3 py-1 text-xs font-semibold">SKU</TableHead>
              <TableHead className="h-8 px-3 py-1 text-xs font-semibold">Type</TableHead>
              <TableHead className="h-8 px-3 py-1 text-xs font-semibold text-right">Price</TableHead>
              <TableHead className="h-8 px-3 py-1 text-xs font-semibold text-right">Cost</TableHead>
              <TableHead className="h-8 px-3 py-1 text-xs font-semibold text-right">Stock</TableHead>
              <TableHead className="h-8 px-3 py-1 text-xs font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id} className="hover:bg-muted/30 border-b border-border/50 h-12">
                <TableCell className="px-3 py-1">
                  <div className="flex items-center gap-2">
                    <div className="relative w-8 h-8 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-foreground truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{product.category}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-3 py-1 text-xs text-muted-foreground">{product.sku}</TableCell>
                <TableCell className="px-3 py-1">
                  <Badge variant="outline" className="text-xs py-0 px-1.5 h-5">
                    {product.type.replace(/_/g, " ")}
                  </Badge>
                </TableCell>
                <TableCell className="px-3 py-1 text-right font-medium text-sm">
                  Rp {product.price.toLocaleString("id-ID")}
                </TableCell>
                <TableCell className="px-3 py-1 text-right text-xs text-muted-foreground">
                  Rp {product.cost.toLocaleString("id-ID")}
                </TableCell>
                <TableCell className={`px-3 py-1 text-right font-semibold text-sm ${getStockColor(product.stock)}`}>
                  {product.stock}
                </TableCell>
                <TableCell className="px-3 py-1 text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onEdit(product)}
                      className="h-7 px-2 gap-1 text-xs"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No products found</p>
        </div>
      )}
    </Card>
  )
}
