"use client"
import MainLayout from "@/components/layout/main-layout"
import TransactionReport from "@/components/reports/transaction-report"
import SalesReport from "@/components/reports/sales-report"
import CloseCashierReport from "@/components/reports/close-cashier-report"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ReportsPage() {
  return (
    <MainLayout>
      <div className="p-4 space-y-4">
        {/* Header */}
        <h1 className="text-2xl font-bold text-foreground">Reports</h1>

        {/* Tabs */}
        <Tabs defaultValue="transactions" className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-3">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="cashier">Close Cashier</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="space-y-4">
            <TransactionReport />
          </TabsContent>

          <TabsContent value="sales" className="space-y-4">
            <SalesReport />
          </TabsContent>

          <TabsContent value="cashier" className="space-y-4">
            <CloseCashierReport />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
