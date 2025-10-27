"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2, Plus, Phone, MapPin } from "lucide-react"

interface Supplier {
  id: string
  name: string
  phone: string
  address: string
  invoiceCount: number
  totalDebt: number
}

const mockSuppliers: Supplier[] = [
  {
    id: "1",
    name: "PT Supplier A",
    phone: "0812-3456-7890",
    address: "Jl. Merdeka No. 123, Jakarta",
    invoiceCount: 12,
    totalDebt: 5000000,
  },
  {
    id: "2",
    name: "PT Supplier B",
    phone: "0821-9876-5432",
    address: "Jl. Sudirman No. 456, Bandung",
    invoiceCount: 8,
    totalDebt: 0,
  },
  {
    id: "3",
    name: "CV Supplier C",
    phone: "0831-2345-6789",
    address: "Jl. Ahmad Yani No. 789, Surabaya",
    invoiceCount: 5,
    totalDebt: 2500000,
  },
]

export default function SupplierList() {
  const [suppliers, setSuppliers] = useState(mockSuppliers)
  const [searchQuery, setSearchQuery] = useState("")
  const [showForm, setShowForm] = useState(false)

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) || supplier.phone.includes(searchQuery),
  )

  const handleDeleteSupplier = (id: string) => {
    setSuppliers(suppliers.filter((s) => s.id !== id))
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex gap-2 justify-between items-center">
        <div className="flex-1 relative">
          <Input
            placeholder="Search suppliers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Supplier
        </Button>
      </div>

      {/* Suppliers Table */}
      <Card className="p-4">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supplier Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Address</TableHead>
                <TableHead className="text-right">Invoices</TableHead>
                <TableHead className="text-right">Total Debt</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell className="font-medium">{supplier.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      {supplier.phone}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span className="line-clamp-1">{supplier.address}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{supplier.invoiceCount}</TableCell>
                  <TableCell className="text-right font-medium">
                    {supplier.totalDebt > 0 ? `Rp ${supplier.totalDebt.toLocaleString("id-ID")}` : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" className="gap-1 bg-transparent">
                        <Edit className="w-4 h-4" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteSupplier(supplier.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredSuppliers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No suppliers found</p>
          </div>
        )}
      </Card>
    </div>
  )
}
