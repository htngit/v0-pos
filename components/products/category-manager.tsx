"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2, Plus } from "lucide-react"
import { useProductStore } from "@/lib/stores/productStore"
import { Category as CategoryType } from "@/lib/db"
import { useNotificationStore } from "@/lib/stores/notificationStore"

export default function CategoryManager() {
  const { categories, loading, fetchCategories, addCategory, updateCategory, deleteCategory } = useProductStore()
  const { showNotification } = useNotificationStore()
  const [newCategory, setNewCategory] = useState("")
  const [newDescription, setNewDescription] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")
  const [editingDescription, setEditingDescription] = useState("")

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return

    try {
      await addCategory({
        name: newCategory.trim(),
        description: newDescription.trim() || null,
        createdBy: 'current-user-id', // Will be replaced with actual user ID
      });

      showNotification({
        type: 'saved_order',
        title: "Success",
        message: "Category added successfully",
        data: null,
      });

      setNewCategory("");
      setNewDescription("");
    } catch (error: any) {
      showNotification({
        type: 'low_stock',
        title: "Error",
        message: error.message || "Failed to add category",
        data: null,
      });
    }
  }

  const handleUpdateCategory = async () => {
    if (!editingId || !editingName.trim()) return;

    try {
      await updateCategory(editingId, {
        name: editingName.trim(),
        description: editingDescription.trim() || null,
      });

      showNotification({
        type: 'saved_order',
        title: "Success",
        message: "Category updated successfully",
        data: null,
      });

      setEditingId(null);
      setEditingName("");
      setEditingDescription("");
    } catch (error: any) {
      showNotification({
        type: 'low_stock',
        title: "Error",
        message: error.message || "Failed to update category",
        data: null,
      });
    }
  }

  const handleDeleteCategory = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete category "${name}"?`)) {
      try {
        await deleteCategory(id);
        showNotification({
          type: 'saved_order',
          title: "Success",
          message: "Category deleted successfully",
          data: null,
        });
      } catch (error: any) {
        showNotification({
          type: 'low_stock',
          title: "Error",
          message: error.message || "Failed to delete category",
          data: null,
        });
      }
    }
  }

  const startEditing = (category: CategoryType) => {
    setEditingId(category.id);
    setEditingName(category.name);
    setEditingDescription(category.description || "");
  }

  const cancelEditing = () => {
    setEditingId(null);
    setEditingName("");
    setEditingDescription("");
  }

  // Calculate product count for each category
  const getCategoryProductCount = (categoryId: string) => {
    // In a real implementation, this would count products in the category
    // For now, we'll return a placeholder
    return 0;
  }

  return (
    <div className="space-y-4">
      {/* Add New Category */}
      <Card className="p-4">
        <h3 className="font-semibold text-foreground mb-4">Add New Category</h3>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              placeholder="Category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              disabled={loading}
            />
            <Input
              placeholder="Description (optional)"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              disabled={loading}
            />
          </div>
          <Button onClick={handleAddCategory} className="gap-2" disabled={loading || !newCategory.trim()}>
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Loading...</TableCell>
                </TableRow>
              ) : categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No categories found</TableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{category.description || '-'}</TableCell>
                    <TableCell className="text-right">{getCategoryProductCount(category.id)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEditing(category)}
                          className="gap-1 bg-transparent"
                          disabled={loading}
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteCategory(category.id, category.name)}
                          className="text-destructive hover:text-destructive"
                          disabled={loading}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Edit Category Modal */}
      {editingId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md p-6">
            <h3 className="font-semibold text-foreground mb-4">Edit Category</h3>
            <div className="space-y-3 mb-4">
              <Input
                placeholder="Category name"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                disabled={loading}
              />
              <Input
                placeholder="Description (optional)"
                value={editingDescription}
                onChange={(e) => setEditingDescription(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={cancelEditing} disabled={loading}>
                Cancel
              </Button>
              <Button onClick={handleUpdateCategory} disabled={loading || !editingName.trim()}>
                Save
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
