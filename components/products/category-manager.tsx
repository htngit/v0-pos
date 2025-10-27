"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2, Plus } from "lucide-react"

interface Category {
  id: string
  name: string
  description: string
  productCount: number
}

const mockCategories: Category[] = [
  { id: "1", name: "Food", description: "Ready-to-eat food items", productCount: 12 },
  { id: "2", name: "Beverage", description: "Drinks and beverages", productCount: 8 },
  { id: "3", name: "Raw Material", description: "Ingredients and raw materials", productCount: 15 },
]

export default function CategoryManager() {
  const [categories, setCategories] = useState(mockCategories)
  const [newCategory, setNewCategory] = useState("")
  const [newDescription, setNewDescription] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleAddCategory = () => {
    if (!newCategory.trim()) return

    const category: Category = {
      id: Date.now().toString(),
      name: newCategory,
      description: newDescription,
      productCount: 0,
    }

    setCategories([...categories, category])
    setNewCategory("")
    setNewDescription("")
  }

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter((cat) => cat.id !== id))
  }

  return (
    <div className="space-y-4">
      {/* Add New Category */}
      <Card className="p-4">
        <h3 className="font-semibold text-foreground mb-4">Add New Category</h3>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input placeholder="Category name" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
            <Input
              placeholder="Description (optional)"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
          </div>
          <Button onClick={handleAddCategory} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Category
          </Button>
        </div>
      </Card>

      {/* Categories List */}
      <Card className="p-4">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Products</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{category.description}</TableCell>
                  <TableCell className="text-right">{category.productCount}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" className="gap-1 bg-transparent">
                        <Edit className="w-4 h-4" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
