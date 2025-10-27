"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Save } from "lucide-react"

export default function TaxSettings() {
  const [settings, setSettings] = useState({
    taxEnabled: true,
    taxRate: 10,
    taxTiming: "after_discount", // 'before_discount' | 'after_discount' | 'included'
  })

  const handleChange = (field: string, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Saving tax settings:", settings)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tax Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Enable Tax */}
          <label className="flex items-center gap-3 cursor-pointer">
            <Checkbox
              checked={settings.taxEnabled}
              onCheckedChange={(checked) => handleChange("taxEnabled", checked)}
            />
            <span className="text-sm font-medium text-foreground">Enable Tax on Transactions</span>
          </label>

          {settings.taxEnabled && (
            <>
              {/* Tax Rate */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Tax Rate (%)</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={settings.taxRate}
                  onChange={(e) => handleChange("taxRate", Number(e.target.value))}
                />
              </div>

              {/* Tax Timing */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Tax Calculation Timing</label>
                <Select value={settings.taxTiming} onValueChange={(value) => handleChange("taxTiming", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="before_discount">Tax BEFORE Discount</SelectItem>
                    <SelectItem value="after_discount">Tax AFTER Discount</SelectItem>
                    <SelectItem value="included">Price INCLUDES Tax</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Example Calculation */}
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <p className="text-sm font-semibold text-foreground">Example Calculation:</p>
                <div className="text-xs text-muted-foreground space-y-1">
                  {settings.taxTiming === "before_discount" && (
                    <>
                      <p>Subtotal: Rp 100.000</p>
                      <p>Tax (10%): Rp 10.000</p>
                      <p>Subtotal with Tax: Rp 110.000</p>
                      <p>Discount (10%): Rp 11.000</p>
                      <p className="font-semibold text-foreground">Total: Rp 99.000</p>
                    </>
                  )}
                  {settings.taxTiming === "after_discount" && (
                    <>
                      <p>Subtotal: Rp 100.000</p>
                      <p>Discount (10%): Rp 10.000</p>
                      <p>Subtotal after Discount: Rp 90.000</p>
                      <p>Tax (10%): Rp 9.000</p>
                      <p className="font-semibold text-foreground">Total: Rp 99.000</p>
                    </>
                  )}
                  {settings.taxTiming === "included" && (
                    <>
                      <p>Display Price: Rp 110.000 (includes 10% tax)</p>
                      <p>Actual Price: Rp 100.000</p>
                      <p>Tax: Rp 10.000 (already included)</p>
                      <p className="font-semibold text-foreground">Total: Rp 110.000</p>
                    </>
                  )}
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end pt-4 border-t border-border">
            <Button type="submit" className="gap-2 bg-primary hover:bg-primary/90">
              <Save className="w-4 h-4" />
              Save Settings
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
