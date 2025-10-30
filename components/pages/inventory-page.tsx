"use client"

import { useState, useEffect } from "react"
import MainLayout from "@/components/layout/main-layout"
import StockList from "@/components/inventory/stock-list"
import PurchaseInvoiceForm from "@/components/inventory/purchase-invoice-form"
import StockOpnameForm from "@/components/inventory/stock-opname-form"
import StockWasteForm from "@/components/inventory/stock-waste-form"
import SupplierList from "@/components/inventory/supplier-list"
import InvoiceDetails from "@/components/inventory/invoice-details"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus } from "lucide-react"

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState("stock")
  const [showInvoiceForm, setShowInvoiceForm] = useState(false)
  const [showOpnameForm, setShowOpnameForm] = useState(false)
  const [showWasteForm, setShowWasteForm] = useState(false)

  // Handle tab changes to trigger data fetching when needed
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // If switching to invoices tab, we could trigger a refresh of invoice data
    // The InvoiceDetails component will handle this through its own useEffect
    if (value === "invoices") {
      // The InvoiceDetails component will automatically fetch invoices when mounted
      // This useEffect in inventory page ensures the tab switch is tracked
      console.log("Switched to invoices tab");
    }
  };

  useEffect(() => {
    // Set default active tab
    if (!activeTab) {
      setActiveTab("stock");
    }
  }, [activeTab]);

  return (
    <MainLayout>
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Inventory Management</h1>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
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
            <InvoiceDetails onNewInvoiceClick={() => setShowInvoiceForm(true)} />
            
            {/* New Invoice Modal */}
            <Dialog open={showInvoiceForm} onOpenChange={setShowInvoiceForm}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add Purchase Invoice</DialogTitle>
                </DialogHeader>
                <PurchaseInvoiceForm onClose={() => setShowInvoiceForm(false)} />
              </DialogContent>
            </Dialog>
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
