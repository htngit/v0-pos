"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Save, Lock } from "lucide-react"

export default function AccountSettings() {
  const [formData, setFormData] = useState({
    email: "user@example.com",
    name: "Demo User",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [showPasswordForm, setShowPasswordForm] = useState(false)

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmitProfile = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Updating profile:", { email: formData.email, name: formData.name })
  }

  const handleSubmitPassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.newPassword !== formData.confirmPassword) {
      alert("Passwords do not match")
      return
    }
    console.log("Changing password")
    setShowPasswordForm(false)
    setFormData((prev) => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }))
  }

  return (
    <div className="space-y-4">
      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitProfile} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Full Name</label>
              <Input
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Your full name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email Address</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="your@email.com"
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-border">
              <Button type="submit" className="gap-2 bg-primary hover:bg-primary/90">
                <Save className="w-4 h-4" />
                Save Profile
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Password Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
        </CardHeader>
        <CardContent>
          {!showPasswordForm ? (
            <Button onClick={() => setShowPasswordForm(true)} variant="outline" className="gap-2 bg-transparent">
              <Lock className="w-4 h-4" />
              Change Password
            </Button>
          ) : (
            <form onSubmit={handleSubmitPassword} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Current Password</label>
                <Input
                  type="password"
                  value={formData.currentPassword}
                  onChange={(e) => handleChange("currentPassword", e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">New Password</label>
                <Input
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) => handleChange("newPassword", e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Confirm Password</label>
                <Input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setShowPasswordForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  Update Password
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
