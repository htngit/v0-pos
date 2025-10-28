"use client"
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Lock } from "lucide-react";
import { useSettingsStore } from "@/lib/stores/settingsStore";
import { useAuthStore } from "@/lib/stores/authStore";
import { AccountSettings as AccountSettingsType } from "@/lib/types/settings";

export default function AccountSettings() {
  const { getSetting, updateSetting, isLoading } = useSettingsStore();
  const { user } = useAuthStore();
  const [formData, setFormData] = useState<AccountSettingsType & { currentPassword: string; newPassword: string; confirmPassword: string }>({
    email: "user@example.com",
    name: "Demo User",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load initial settings
  useEffect(() => {
    const initialSettings = getSetting('account');
    if (initialSettings) {
      setFormData(prev => ({ ...prev, ...initialSettings }));
    }
  }, [getSetting]);

  const handleChange = (field: keyof AccountSettingsType | 'currentPassword' | 'newPassword' | 'confirmPassword', value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      // Update only the account settings part
      const accountSettings: AccountSettingsType = {
        email: formData.email,
        name: formData.name,
      };
      await updateSetting('account', accountSettings, user.id);
      setSuccess('Profile updated successfully');
      setError(null);
    } catch (error) {
      setError('Failed to update profile');
      setSuccess(null);
      console.error("Failed to update profile:", error);
    }
  };

  const handleSubmitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // TODO: Implement actual password change logic here
    // This would typically involve calling an auth service to update the password
    try {
      console.log("Changing password for user:", user.id);
      setShowPasswordForm(false);
      setFormData((prev) => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
      setSuccess('Password changed successfully');
      setError(null);
    } catch (error) {
      setError('Failed to change password');
      setSuccess(null);
      console.error("Failed to change password:", error);
    }
  };

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

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}

            <div className="flex justify-end pt-4 border-t border-border">
              <Button type="submit" className="gap-2 bg-primary hover:bg-primary/90" disabled={isLoading}>
                <Save className="w-4 h-4" />
                {isLoading ? 'Saving...' : 'Save Profile'}
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
            <Button onClick={() => setShowPasswordForm(true)} variant="outline" className="gap-2 bg-transparent" disabled={isLoading}>
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
                  placeholder="•••••••"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">New Password</label>
                <Input
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) => handleChange("newPassword", e.target.value)}
                  placeholder="•••••••"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Confirm Password</label>
                <Input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  placeholder="•••••••"
                  required
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex gap-2 justify-end pt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setShowPasswordForm(false)} disabled={isLoading}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isLoading}>
                  {isLoading ? 'Updating...' : 'Update Password'}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
