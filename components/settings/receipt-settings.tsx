"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Save, Eye } from "lucide-react"

export default function ReceiptSettings() {
  const [settings, setSettings] = useState({
    showLogo: true,
    showBusinessName: true,
    showAddress: true,
    showPhone: true,
    showCashierName: true,
    showTransactionDate: true,
    showItemList: true,
    showSubtotal: true,
    showDiscount: true,
    showTax: true,
    showTotal: true,
    showPaymentMethod: true,
    showChange: true,
    customMessage: "Terima kasih atas kunjungan Anda!",
    showBarcode: true,
  })

  const handleToggle = (field: string) => {
    setSettings((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  const handleChange = (field: string, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Saving receipt settings:", settings)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Receipt Template Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Header Section */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Header</h3>
              <div className="space-y-2">
                {[
                  { key: "showLogo", label: "Show Business Logo" },
                  { key: "showBusinessName", label: "Show Business Name" },
                  { key: "showAddress", label: "Show Business Address" },
                  { key: "showPhone", label: "Show Business Phone" },
                  { key: "showCashierName", label: "Show Cashier Name" },
                  { key: "showTransactionDate", label: "Show Transaction Date/Time" },
                ].map((item) => (
                  <label key={item.key} className="flex items-center gap-3 cursor-pointer">
                    <Checkbox
                      checked={settings[item.key as keyof typeof settings] as boolean}
                      onCheckedChange={() => handleToggle(item.key)}
                    />
                    <span className="text-sm font-medium text-foreground">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Body Section */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Body</h3>
              <div className="space-y-2">
                {[
                  { key: "showItemList", label: "Show Item List" },
                  { key: "showSubtotal", label: "Show Subtotal" },
                  { key: "showDiscount", label: "Show Discount" },
                  { key: "showTax", label: "Show Tax" },
                  { key: "showTotal", label: "Show Total" },
                  { key: "showPaymentMethod", label: "Show Payment Method" },
                  { key: "showChange", label: "Show Change" },
                ].map((item) => (
                  <label key={item.key} className="flex items-center gap-3 cursor-pointer">
                    <Checkbox
                      checked={settings[item.key as keyof typeof settings] as boolean}
                      onCheckedChange={() => handleToggle(item.key)}
                    />
                    <span className="text-sm font-medium text-foreground">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Footer Section */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Footer</h3>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Custom Message</label>
                <textarea
                  value={settings.customMessage}
                  onChange={(e) => handleChange("customMessage", e.target.value)}
                  placeholder="Add custom message for receipt footer"
                  className="w-full h-16 p-3 border border-border rounded-lg bg-background text-foreground"
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <Checkbox checked={settings.showBarcode} onCheckedChange={() => handleToggle("showBarcode")} />
                <span className="text-sm font-medium text-foreground">Show Transaction Barcode/QR</span>
              </label>
            </div>

            <div className="flex gap-2 justify-end pt-4 border-t border-border">
              <Button type="button" variant="outline" className="gap-2 bg-transparent">
                <Eye className="w-4 h-4" />
                Preview
              </Button>
              <Button type="submit" className="gap-2 bg-primary hover:bg-primary/90">
                <Save className="w-4 h-4" />
                Save Settings
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
