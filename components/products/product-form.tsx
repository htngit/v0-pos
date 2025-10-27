"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"

interface ProductFormProps {
  product: any
  onClose: () => void
}

export default function ProductForm({ product, onClose }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    sku: product?.sku || "",
    category: product?.category || "",
    type: product?.type || "finish_goods",
    price: product?.price || "",
    cost: product?.cost || "",
    minStock: product?.minStock || "",
    monitorStock: product?.monitorStock || true,
  })

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Save product
    console.log("Saving product:", formData)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-border">
          <CardTitle>{product ? "Edit Product" : "Add New Product"}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Basic Information</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Product Name *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="e.g., Bakso Sapi"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">SKU</label>
                  <Input
                    value={formData.sku}
                    onChange={(e) => handleChange("sku", e.target.value)}
                    placeholder="e.g., BSP-001"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Category *</label>
                  <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Food">Food</SelectItem>
                      <SelectItem value="Beverage">Beverage</SelectItem>
                      <SelectItem value="Raw Material">Raw Material</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Product Type *</label>
                  <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="finish_goods">Finish Goods</SelectItem>
                      <SelectItem value="recipe_goods">Recipe Goods</SelectItem>
                      <SelectItem value="raw_material">Raw Material</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Pricing</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Selling Price (Rp) *</label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    placeholder="0"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Cost/HPP (Rp) *</label>
                  <Input
                    type="number"
                    value={formData.cost}
                    onChange={(e) => handleChange("cost", e.target.value)}
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              {/* Profit Display */}
              {formData.price && formData.cost && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Profit Margin:{" "}
                    <span className="font-semibold text-foreground">
                      Rp {(Number(formData.price) - Number(formData.cost)).toLocaleString("id-ID")} (
                      {(((Number(formData.price) - Number(formData.cost)) / Number(formData.price)) * 100).toFixed(1)}%)
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Stock Management */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Stock Management</h3>

              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.monitorStock}
                    onChange={(e) => handleChange("monitorStock", e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium text-foreground">Monitor Stock</span>
                </label>

                {formData.monitorStock && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Minimum Stock Level</label>
                    <Input
                      type="number"
                      value={formData.minStock}
                      onChange={(e) => handleChange("minStock", e.target.value)}
                      placeholder="0"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Recipe (if recipe_goods) */}
            {formData.type === "recipe_goods" && (
              <div className="space-y-4 p-4 bg-muted rounded-lg border border-border">
                <h3 className="font-semibold text-foreground">Recipe Ingredients</h3>
                <p className="text-sm text-muted-foreground">
                  Add ingredients and quantities. Stock will be calculated automatically.
                </p>
                <Button type="button" variant="outline" className="w-full bg-transparent">
                  Add Ingredient
                </Button>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 justify-end pt-4 border-t border-border">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                {product ? "Update Product" : "Add Product"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
