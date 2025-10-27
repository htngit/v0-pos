"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Search, Phone } from "lucide-react"

interface Customer {
  id: string
  name: string
  phone: string
  gender: string
  totalTransactions: number
  totalSpent: number
  lastTransaction: string
}

const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "Budi Santoso",
    phone: "0812-3456-7890",
    gender: "Male",
    totalTransactions: 15,
    totalSpent: 450000,
    lastTransaction: "2 hours ago",
  },
  {
    id: "2",
    name: "Siti Nurhaliza",
    phone: "0821-9876-5432",
    gender: "Female",
    totalTransactions: 8,
    totalSpent: 280000,
    lastTransaction: "1 day ago",
  },
  {
    id: "3",
    name: "Ahmad Wijaya",
    phone: "0831-2345-6789",
    gender: "Male",
    totalTransactions: 22,
    totalSpent: 720000,
    lastTransaction: "30 mins ago",
  },
  {
    id: "4",
    name: "Rina Kusuma",
    phone: "0841-5678-9012",
    gender: "Female",
    totalTransactions: 5,
    totalSpent: 125000,
    lastTransaction: "3 days ago",
  },
]

interface CustomerListProps {
  onEdit: (customer: Customer) => void
}

export default function CustomerList({ onEdit }: CustomerListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [customers, setCustomers] = useState(mockCustomers)

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) || customer.phone.includes(searchQuery),
  )

  const handleDeleteCustomer = (id: string) => {
    setCustomers(customers.filter((c) => c.id !== id))
  }

  return (
    <Card className="p-4">
      {/* Search */}
      <div className="mb-4 flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead className="text-right">Transactions</TableHead>
              <TableHead className="text-right">Total Spent</TableHead>
              <TableHead className="text-right">Last Transaction</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">{customer.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    {customer.phone}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{customer.gender}</Badge>
                </TableCell>
                <TableCell className="text-right">{customer.totalTransactions}</TableCell>
                <TableCell className="text-right font-medium">
                  Rp {customer.totalSpent.toLocaleString("id-ID")}
                </TableCell>
                <TableCell className="text-right text-sm text-muted-foreground">{customer.lastTransaction}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => onEdit(customer)} className="gap-1">
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteCustomer(customer.id)}
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

      {filteredCustomers.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No customers found</p>
        </div>
      )}
    </Card>
  )
}
