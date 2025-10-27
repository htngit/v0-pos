"use client"

import { useState } from "react"
import MainLayout from "@/components/layout/main-layout"
import CustomerList from "@/components/customers/customer-list"
import CustomerForm from "@/components/customers/customer-form"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function CustomersPage() {
  const [showForm, setShowForm] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState(null)

  const handleAddCustomer = () => {
    setEditingCustomer(null)
    setShowForm(true)
  }

  const handleEditCustomer = (customer: any) => {
    setEditingCustomer(customer)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingCustomer(null)
  }

  return (
    <MainLayout>
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Customer Management</h1>
          <Button onClick={handleAddCustomer} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Customer
          </Button>
        </div>

        {/* Customer List */}
        <CustomerList onEdit={handleEditCustomer} />

        {/* Customer Form Modal */}
        {showForm && <CustomerForm customer={editingCustomer} onClose={handleCloseForm} />}
      </div>
    </MainLayout>
  )
}
