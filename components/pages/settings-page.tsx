"use client"
import MainLayout from "@/components/layout/main-layout"
import ReceiptSettings from "@/components/settings/receipt-settings"
import TaxSettings from "@/components/settings/tax-settings"
import AccountSettings from "@/components/settings/account-settings"
import BusinessSettings from "@/components/settings/business-settings"
import DataHealth from "@/components/settings/data-health"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SettingsPage() {
  return (
    <MainLayout>
      <div className="p-4 space-y-4">
        {/* Header */}
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>

        {/* Tabs */}
        <Tabs defaultValue="business" className="w-full">
          <TabsList className="grid w-full max-w-3xl grid-cols-5">
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="receipt">Receipt</TabsTrigger>
            <TabsTrigger value="tax">Tax</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
          </TabsList>

          <TabsContent value="business" className="space-y-4">
            <BusinessSettings />
          </TabsContent>

          <TabsContent value="receipt" className="space-y-4">
            <ReceiptSettings />
          </TabsContent>

          <TabsContent value="tax" className="space-y-4">
            <TaxSettings />
          </TabsContent>

          <TabsContent value="account" className="space-y-4">
            <AccountSettings />
          </TabsContent>

          <TabsContent value="data" className="space-y-4">
            <DataHealth />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
