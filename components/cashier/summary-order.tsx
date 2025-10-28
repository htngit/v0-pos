"use client"

import { useState } from "react"
import { CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Minus, X } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import OrderListModal from "./order-list-modal"
import { useCashierStore } from "@/lib/stores/cashierStore"

export default function SummaryOrder() {
  const {
    cart,
    selectedCustomer,
    removeFromCart,
    updateQuantity,
    clearCart,
    calculateSubtotal,
    calculateTotal,
    saveOrder
  } = useCashierStore()

  const [discountPercent, setDiscountPercent] = useState(0)
  const [taxEnabled, setTaxEnabled] = useState(true)
  const [isOrderListOpen, setIsOrderListOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const subtotal = calculateSubtotal()
  const discountAmount = (subtotal * discountPercent) / 100
  const taxAmount = taxEnabled ? ((subtotal - discountAmount) * 10) / 100 : 0
  const total = subtotal - discountAmount + taxAmount

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    updateQuantity(productId, quantity)
  }

  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId)
  }

  const handleClearCart = () => {
    clearCart()
  }

  const handleSaveOrder = async () => {
    if (cart.length === 0) return

    setIsSaving(true)
    try {
      await saveOrder()
      // Cart is cleared automatically in the store
    } catch (error) {
      console.error('Failed to save order:', error)
      // TODO: Show error notification
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="h-full flex flex-col bg-card rounded-lg border border-border overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-2 gap-2 p-3 border-b border-border flex-shrink-0">
        <Button variant="outline" className="text-sm bg-transparent" onClick={() => setIsOrderListOpen(true)}>
          Daftar Order
        </Button>
        <Button variant="outline" className="text-sm bg-transparent">
          Pilih Pelanggan
        </Button>
      </div>

      {/* Items */}
      <CardContent className="flex-1 overflow-y-auto p-3 space-y-2">
        {cart.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            <p className="text-sm">No items in cart</p>
          </div>
        ) : (
          cart.map((item) => (
            <div
              key={item.productId}
              className="flex items-start gap-2 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-foreground truncate">{item.name}</p>
                <p className="text-xs text-muted-foreground">Rp {item.price.toLocaleString("id-ID")}</p>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                  onClick={() => handleUpdateQuantity(item.productId, item.qty - 1)}
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="w-6 text-center text-sm font-medium">{item.qty}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                  onClick={() => handleUpdateQuantity(item.productId, item.qty + 1)}
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>

              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                onClick={() => handleRemoveItem(item.productId)}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))
        )}
      </CardContent>

      {/* Totals */}
      <div className="border-t border-border p-3 space-y-3 flex-shrink-0">
        {/* Discount Input */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Diskon (%)</label>
          <Input
            type="number"
            min="0"
            max="100"
            value={discountPercent}
            onChange={(e) => setDiscountPercent(Number(e.target.value))}
            className="h-8 text-sm"
          />
        </div>

        {/* Calculations */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>Rp {subtotal.toLocaleString("id-ID")}</span>
          </div>

          {discountAmount > 0 && (
            <div className="flex justify-between text-muted-foreground">
              <span>Discount</span>
              <span className="text-destructive">-Rp {discountAmount.toLocaleString("id-ID")}</span>
            </div>
          )}

          {taxEnabled && (
            <div className="flex justify-between text-muted-foreground">
              <span>Tax (10%)</span>
              <span>Rp {taxAmount.toLocaleString("id-ID")}</span>
            </div>
          )}

          <Separator />

          <div className="flex justify-between font-semibold text-base">
            <span>Total</span>
            <span className="text-primary">Rp {total.toLocaleString("id-ID")}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <Button
            variant="outline"
            disabled={cart.length === 0 || isSaving}
            onClick={handleSaveOrder}
          >
            {isSaving ? "Menyimpan..." : "Simpan Order"}
          </Button>
          <Button
            className="bg-primary hover:bg-primary/90"
            disabled={cart.length === 0}
          >
            Checkout
          </Button>
        </div>
      </div>

      <OrderListModal isOpen={isOrderListOpen} onClose={() => setIsOrderListOpen(false)} />
    </div>
  )
}
