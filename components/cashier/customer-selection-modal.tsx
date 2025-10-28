"use client"

import { useState, useEffect } from "react"
import { X, Search, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCustomerStore } from "@/lib/stores/customerStore"
import { useCashierStore } from "@/lib/stores/cashierStore"
import { Customer } from "@/lib/db"

interface CustomerSelectionModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CustomerSelectionModal({ isOpen, onClose }: CustomerSelectionModalProps) {
  const { customers, loading, error, fetchCustomers, searchCustomers } = useCustomerStore()
  const { selectCustomer, selectedCustomer } = useCashierStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    gender: null as 'male' | 'female' | null
  })

  // Load customers when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchCustomers()
    }
  }, [isOpen, fetchCustomers])

  const filteredCustomers = searchCustomers(searchQuery)

  const handleSelectCustomer = (customer: Customer) => {
    selectCustomer(customer)
    onClose()
  }

  const handleClearCustomer = () => {
    selectCustomer(null)
    onClose()
  }

  const handleAddCustomer = async () => {
    if (!newCustomer.name.trim()) return

    try {
      await useCustomerStore.getState().addCustomer({
        name: newCustomer.name.trim(),
        phone: newCustomer.phone.trim() || null,
        gender: newCustomer.gender,
        createdBy: 'current-user-id' // TODO: Get from authStore
      })

      // Reset form
      setNewCustomer({ name: "", phone: "", gender: null })
      setShowAddForm(false)
    } catch (error) {
      console.error('Failed to add customer:', error)
      // TODO: Show error notification
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-background w-full max-w-2xl max-h-[80vh] rounded-lg flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
          <h2 className="text-lg font-semibold">Pilih Pelanggan</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Search and Add */}
        <div className="p-4 border-b border-border flex-shrink-0 space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cari pelanggan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Tambah
            </Button>
          </div>

          {/* Add Customer Form */}
          {showAddForm && (
            <div className="border border-border rounded-lg p-3 space-y-3 bg-muted/20">
              <h3 className="font-medium text-sm">Tambah Pelanggan Baru</h3>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="Nama pelanggan"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, name: e.target.value }))}
                />
                <Input
                  placeholder="Nomor telepon (opsional)"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddCustomer} disabled={!newCustomer.name.trim()}>
                  Simpan
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowAddForm(false)}>
                  Batal
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Customer List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm">Loading customers...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              <div className="text-center">
                <p className="text-destructive mb-2">Error loading customers</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          ) : (
            <div className="p-4 space-y-2">
              {/* No customer option */}
              <div
                className="p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={handleClearCustomer}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">—</span>
                  </div>
                  <div>
                    <p className="font-medium">Tanpa Pelanggan</p>
                    <p className="text-sm text-muted-foreground">Transaksi tanpa data pelanggan</p>
                  </div>
                </div>
              </div>

              {/* Customer list */}
              {filteredCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className={`p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors ${
                    selectedCustomer?.id === customer.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handleSelectCustomer(customer)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {customer.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{customer.name}</p>
                      {customer.phone && (
                        <p className="text-sm text-muted-foreground">{customer.phone}</p>
                      )}
                    </div>
                    {selectedCustomer?.id === customer.id && (
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                    )}
                  </div>
                </div>
              ))}

              {filteredCustomers.length === 0 && searchQuery && (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">Tidak ada pelanggan ditemukan</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}