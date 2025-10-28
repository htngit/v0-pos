"use client"

import { useState } from "react"
import MainLayout from "@/components/layout/main-layout"
import StockList from "@/components/inventory/stock-list"
import PurchaseInvoiceForm from "@/components/inventory/purchase-invoice-form"
import StockOpnameForm from "@/components/inventory/stock-opname-form"
import StockWasteForm from "@/components/inventory/stock-waste-form"
import SupplierList from "@/components/inventory/supplier-list"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"

export default function InventoryPage() {
  const [showInvoiceForm, setShowInvoiceForm] = useState(false)
  const [showOpnameForm, setShowOpnameForm] = useState(false)
  const [showWasteForm, setShowWasteForm] = useState(false)

  return (
    <MainLayout>
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Inventory Management</h1>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="stock" className="w-full">
          <TabsList className="grid w-full max-w-3xl grid-cols-5">
            <TabsTrigger value="stock">Stock</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="opname">Opname</TabsTrigger>
            <TabsTrigger value="waste">Waste</TabsTrigger>
            <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          </TabsList>

          {/* Stock Tab */}
          <TabsContent value="stock" className="space-y-4">
            <StockList />
          </TabsContent>

          {/* Invoices Tab */}
          <TabsContent value="invoices" className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setShowInvoiceForm(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                New Invoice
              </Button>
            </div>
            {showInvoiceForm && <PurchaseInvoiceForm onClose={() => setShowInvoiceForm(false)} />}
          </TabsContent>

          {/* Stock Opname Tab */}
          <TabsContent value="opname" className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setShowOpnameForm(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                New Opname
              </Button>
            </div>
            {showOpnameForm && <StockOpnameForm onClose={() => setShowOpnameForm(false)} />}
          </TabsContent>

          {/* Stock Waste Tab */}
          <TabsContent value="waste" className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setShowWasteForm(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Record Waste
              </Button>
            </div>
            {showWasteForm && <StockWasteForm onClose={() => setShowWasteForm(false)} />}
          </TabsContent>

          {/* Suppliers Tab */}
          <TabsContent value="suppliers" className="space-y-4">
            <SupplierList />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
