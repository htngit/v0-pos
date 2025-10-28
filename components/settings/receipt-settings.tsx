"use client"

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Eye } from "lucide-react";
import { useSettingsStore } from "@/lib/stores/settingsStore";
import { useAuthStore } from "@/lib/stores/authStore";
import { ReceiptSettings as ReceiptSettingsType } from "@/lib/types/settings";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Label } from "@radix-ui/react-label";

// Create a custom Checkbox component that matches the UI library pattern
const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={`h-4 w-4 rounded border border-input bg-background ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground ${className}`}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export default function ReceiptSettings() {
  const { getSetting, updateSetting, isLoading } = useSettingsStore();
  const { user } = useAuthStore();
  const [settings, setSettings] = useState<ReceiptSettingsType>({
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
  });

  // Load initial settings
  useEffect(() => {
    const initialSettings = getSetting('receipt');
    if (initialSettings) {
      setSettings(initialSettings);
    }
  }, [getSetting]);

  const handleToggle = (field: keyof ReceiptSettingsType) => {
    setSettings((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (field: keyof ReceiptSettingsType, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      await updateSetting('receipt', settings, user.id);
      // Show success notification could go here
    } catch (error) {
      console.error("Failed to save receipt settings:", error);
      // Show error notification could go here
    }
  };

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
                      checked={settings[item.key as keyof ReceiptSettingsType] as boolean}
                      onCheckedChange={(checked: boolean) => handleToggle(item.key as keyof ReceiptSettingsType)}
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
                      checked={settings[item.key as keyof ReceiptSettingsType] as boolean}
                      onCheckedChange={(checked: boolean) => handleToggle(item.key as keyof ReceiptSettingsType)}
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
                <Input
                  value={settings.customMessage}
                  onChange={(e) => handleChange("customMessage", e.target.value)}
                  placeholder="Add custom message for receipt footer"
                  className="w-full p-3 border border-border rounded-lg bg-background text-foreground"
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <Checkbox checked={settings.showBarcode} onCheckedChange={() => handleToggle("showBarcode")} />
                <span className="text-sm font-medium text-foreground">Show Transaction Barcode/QR</span>
              </label>
            </div>

            <div className="flex gap-2 justify-end pt-4 border-t border-border">
              <Button type="button" variant="outline" className="gap-2 bg-transparent" disabled={isLoading}>
                <Eye className="w-4 h-4" />
                Preview
              </Button>
              <Button type="submit" className="gap-2 bg-primary hover:bg-primary/90" disabled={isLoading}>
                <Save className="w-4 h-4" />
                {isLoading ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
