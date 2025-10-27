"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Save } from "lucide-react"

export default function BusinessSettings() {
  const [formData, setFormData] = useState({
    businessName: "Warung Bakso Sapi",
    businessPhone: "0812-3456-7890",
    businessAddress: "Jl. Merdeka No. 123, Jakarta",
    businessEmail: "info@warungbaksosapi.com",
    businessWebsite: "www.warungbaksosapi.com",
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Saving business settings:", formData)
  }

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
              value={formData.businessAddress}
              onChange={(e) => handleChange("businessAddress", e.target.value)}
              placeholder="Business address"
              className="w-full h-20 p-3 border border-border rounded-lg bg-background text-foreground"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Website</label>
            <Input
              value={formData.businessWebsite}
              onChange={(e) => handleChange("businessWebsite", e.target.value)}
              placeholder="www.business.com"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-border">
            <Button type="submit" className="gap-2 bg-primary hover:bg-primary/90">
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
