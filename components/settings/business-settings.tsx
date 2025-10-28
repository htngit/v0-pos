"use client"

import type React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save } from "lucide-react";
import { useSettingsStore } from "@/lib/stores/settingsStore";
import { useAuthStore } from "@/lib/stores/authStore";
import { BusinessSettings as BusinessSettingsType } from "@/lib/types/settings";

export default function BusinessSettings() {
  const { getSetting, updateSetting, isLoading } = useSettingsStore();
  const { user } = useAuthStore();
  const [formData, setFormData] = useState<BusinessSettingsType>({
    businessName: "Warung Bakso Sapi",
    businessPhone: "0812-3456-7890",
    businessAddress: "Jl. Merdeka No. 123, Jakarta",
    businessEmail: "info@warungbaksosapi.com",
    businessWebsite: "www.warungbaksosapi.com",
  });

  // Load initial settings
  useEffect(() => {
    const initialSettings = getSetting('business');
    if (initialSettings) {
      setFormData(initialSettings);
    }
  }, [getSetting]);

  const handleChange = (field: keyof BusinessSettingsType, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      await updateSetting('business', formData, user.id);
      // Show success notification could go here
    } catch (error) {
      console.error("Failed to save business settings:", error);
      // Show error notification could go here
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Business Name *</label>
            <Input
              value={formData.businessName}
              onChange={(e) => handleChange("businessName", e.target.value)}
              placeholder="Your business name"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Phone Number</label>
              <Input
                type="tel"
                value={formData.businessPhone}
                onChange={(e) => handleChange("businessPhone", e.target.value)}
                placeholder="0812-3456-7890"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <Input
                type="email"
                value={formData.businessEmail}
                onChange={(e) => handleChange("businessEmail", e.target.value)}
                placeholder="info@business.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Address</label>
            <textarea
              value={formData.businessAddress || ""}
              onChange={(e) => handleChange("businessAddress", e.target.value)}
              placeholder="Business address"
              className="w-full h-20 p-3 border border-border rounded-lg bg-background text-foreground"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Website</label>
            <Input
              value={formData.businessWebsite || ""}
              onChange={(e) => handleChange("businessWebsite", e.target.value)}
              placeholder="www.business.com"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-border">
            <Button type="submit" className="gap-2 bg-primary hover:bg-primary/90" disabled={isLoading}>
              <Save className="w-4 h-4" />
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
