"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { useProductStore } from "@/lib/stores/productStore";
import { useNotificationStore } from "@/lib/stores/notificationStore";

interface WasteItem {
  id: string;
  productId: string;
  productName: string;
  qty: number;
  unit: string;
  reason: string;
}

export default function StockWasteForm({ onClose }: { onClose: () => void }) {
  const { products, addStockWaste, fetchProducts } = useProductStore();
  const { showNotification } = useNotificationStore();
  const [loading, setLoading] = useState(false);
  const [wasteDate, setWasteDate] = useState(new Date().toISOString().split('T')[0]);
  const [wasteItems, setWasteItems] = useState<WasteItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("unit");
  const [reason, setReason] = useState("");

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addWasteItem = () => {
    if (!selectedProduct || !quantity) {
      showNotification({
        type: 'low_stock',
        title: "Error",
        message: "Please select a product and enter quantity",
        data: null,
      });
      return;
    }

    const product = products.find(p => p.id === selectedProduct);
    if (!product) return;

    const item: WasteItem = {
      id: Date.now().toString(),
      productId: selectedProduct,
      productName: product.name,
      qty: Number(quantity),
      unit: unit || product.uom?.base || "unit",
      reason: reason || "Unspecified reason",
    };

    setWasteItems([...wasteItems, item]);
    setSelectedProduct("");
    setQuantity("");
    setUnit(product.uom?.base || "unit");
    setReason("");
  };

  const removeWasteItem = (id: string) => {
    setWasteItems(wasteItems.filter(item => item.id !== id));
  };

  const handleSubmit = async () => {
    if (wasteItems.length === 0) {
      showNotification({
        type: 'low_stock',
        title: "Error",
        message: "Please add at least one item to the waste record",
        data: null,
      });
      return;
    }

    setLoading(true);
    try {
      // Add each waste item individually
      for (const item of wasteItems) {
        await addStockWaste({
          productId: item.productId,
          qty: item.qty,
          unit: item.unit,
          reason: item.reason,
          createdBy: 'current-user-id', // Will be replaced with actual user ID
        });
      }

      showNotification({
        type: 'saved_order',
        title: "Success",
        message: "Stock waste recorded successfully",
        data: null,
      });

      // Reset form and close
      setWasteItems([]);
      onClose(); // Close the form after successful submission
    } catch (error: any) {
      showNotification({
        type: 'low_stock',
        title: "Error",
        message: error.message || "Failed to record stock waste",
        data: null,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4">
      <CardHeader className="p-0 pb-4">
        <CardTitle>Record Stock Waste</CardTitle>
      </CardHeader>
      <CardContent className="p-0 space-y-4">
        {/* Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Waste Date</label>
          <Input
            type="date"
            value={wasteDate}
            onChange={(e) => setWasteDate(e.target.value)}
          />
        </div>

        {/* Add Item */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Product</label>
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger>
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                {products
                  .filter(p => !p.deletedAt && p.id && p.id.trim() !== '' && p.name && p.name.trim() !== '')
                  .map(product => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} - {product.sku || 'No SKU'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Quantity</label>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0"
              min="0"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Unit</label>
            <Input
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="e.g., unit, kg, liter"
            />
          </div>
          <div className="space-y-2 pb-2.5"> {/* pb-2.5 to align with other inputs */}
            <Button type="button" onClick={addWasteItem} className="w-full gap-2" variant="outline">
              <Plus className="w-4 h-4" />
              Add Item
            </Button>
          </div>
        </div>

        {/* Reason */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Reason (Optional)</label>
          <Textarea
            value={reason}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReason(e.target.value)}
            placeholder="Reason for waste..."
            rows={2}
          />
        </div>

        {/* Items List */}
        <div className="space-y-2">
          <h3 className="font-medium text-foreground">Waste Items</h3>
          {wasteItems.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No items added</p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {wasteItems.map((item) => (
                <div key={item.id} className="flex items-center gap-2 p-3 border rounded-lg border-border bg-muted/30">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground truncate">{item.productName}</p>
                    <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                      <span>{item.qty} {item.unit}</span>
                      <span>•</span>
                      <span className="truncate">{item.reason}</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeWasteItem(item.id)}
                    className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading || wasteItems.length === 0} className="gap-2">
            {loading ? "Saving..." : "Save Waste Record"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}