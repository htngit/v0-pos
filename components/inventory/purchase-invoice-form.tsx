"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Search } from "lucide-react";
import { useProductStore } from "@/lib/stores/productStore";
import { useNotificationStore } from "@/lib/stores/notificationStore";

// Define the interface for invoice items since it's not exported from db
interface InvoiceItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export default function PurchaseInvoiceForm({ onClose }: { onClose: () => void }) {
  const { products, addPurchaseInvoice, fetchProducts } = useProductStore();
  const { showNotification } = useNotificationStore();
  const [loading, setLoading] = useState(false);
  const [supplierName, setSupplierName] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");

 useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addInvoiceItem = () => {
    if (!selectedProduct || !quantity || !unitPrice) {
      showNotification({
        type: 'low_stock',
        title: "Error",
        message: "Please fill all fields",
        data: null,
      });
      return;
    }

    const product = products.find(p => p.id === selectedProduct);
    if (!product) return;

    const item: InvoiceItem = {
      id: Date.now().toString(),
      productId: selectedProduct,
      productName: product.name,
      quantity: Number(quantity),
      unitPrice: Number(unitPrice),
    };

    setInvoiceItems([...invoiceItems, item]);
    setSelectedProduct("");
    setQuantity("");
    setUnitPrice("");
  };

  const removeInvoiceItem = (id: string) => {
    setInvoiceItems(invoiceItems.filter(item => item.id !== id));
  };

  const calculateSubtotal = () => {
    return invoiceItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  const handleSubmit = async () => {
    if (invoiceItems.length === 0) {
      showNotification({
        type: 'low_stock',
        title: "Error",
        message: "Please add at least one item to the invoice",
        data: null,
      });
      return;
    }

    setLoading(true);
    try {
      await addPurchaseInvoice({
        supplierId: "default-supplier", // In a real app, this would be selected from suppliers
        items: invoiceItems.map(item => ({
          productId: item.productId,
          qty: item.quantity,
          unitPrice: item.unitPrice,
          total: item.quantity * item.unitPrice,
        })),
        subtotal: calculateSubtotal(),
        total: calculateSubtotal(), // In a real app, this might include taxes
        paymentMethod: 'kas_outlet',
        paymentType: 'cash',
        status: 'paid',
        paidAmount: calculateSubtotal(),
        remainingDebt: 0,
        createdBy: 'current-user-id', // Will be replaced with actual user ID
      });

      showNotification({
        type: 'saved_order',
        title: "Success",
        message: "Purchase invoice added successfully",
        data: null,
      });

      // Reset form and close
      setSupplierName("");
      setInvoiceItems([]);
      onClose(); // Close the form after successful submission
    } catch (error: any) {
      showNotification({
        type: 'low_stock',
        title: "Error",
        message: error.message || "Failed to add purchase invoice",
        data: null,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4">
      <CardHeader className="p-0 pb-4">
        <CardTitle>Add Purchase Invoice</CardTitle>
      </CardHeader>
      <CardContent className="p-0 space-y-4">
        {/* Supplier and Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Supplier</label>
            <Input
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
              placeholder="Supplier name"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Invoice Date</label>
            <Input
              type="date"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
            />
          </div>
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
                {products.filter(p => !p.deletedAt).map(product => (
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
            <label className="text-sm font-medium text-foreground">Unit Price</label>
            <Input
              type="number"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
              placeholder="0"
              min="0"
            />
          </div>
          <div className="space-y-2 pb-2.5"> {/* pb-2.5 to align with other inputs */}
            <Button type="button" onClick={addInvoiceItem} className="w-full gap-2" variant="outline">
              <Plus className="w-4 h-4" />
              Add Item
            </Button>
          </div>
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto border rounded-lg border-border">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoiceItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">No items added</TableCell>
                </TableRow>
              ) : (
                invoiceItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.productName}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">Rp {item.unitPrice.toLocaleString("id-ID")}</TableCell>
                    <TableCell className="text-right font-medium">Rp {(item.quantity * item.unitPrice).toLocaleString("id-ID")}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeInvoiceItem(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Summary */}
        <div className="flex justify-end border-t pt-4 border-border">
          <div className="w-full max-w-xs space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span className="font-medium">Rp {calculateSubtotal().toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between text-sm font-semibold border-t pt-2 border-border">
              <span>Total:</span>
              <span>Rp {calculateSubtotal().toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading || invoiceItems.length === 0} className="gap-2">
            {loading ? "Saving..." : "Save Invoice"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
