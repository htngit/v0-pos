"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download } from "lucide-react"

interface Transaction {
  id: string
  transactionNumber: string
  date: string
  customer: string
  items: number
  total: number
  paymentMethod: string
  status: "paid" | "unpaid" | "saved"
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    transactionNumber: "TRX-20251026-0001",
    date: "2025-10-26 14:30",
    customer: "Budi Santoso",
    items: 3,
    total: 75000,
    paymentMethod: "Cash",
    status: "paid",
  },
  {
    id: "2",
    transactionNumber: "TRX-20251026-0002",
    date: "2025-10-26 15:45",
    customer: "Siti Nurhaliza",
    items: 2,
    total: 45000,
    paymentMethod: "E-Wallet",
    status: "paid",
  },
  {
    id: "3",
    transactionNumber: "TRX-20251026-0003",
    date: "2025-10-26 16:20",
    customer: "Ahmad Wijaya",
    items: 5,
    total: 120000,
    paymentMethod: "QRIS",
    status: "paid",
  },
  {
    id: "4",
    transactionNumber: "TRX-20251025-0045",
    date: "2025-10-25 18:00",
    customer: "Rina Kusuma",
    items: 1,
    total: 25000,
    paymentMethod: "Cash",
    status: "unpaid",
  },
]

export default function TransactionReport() {
  const [startDate, setStartDate] = useState("2025-10-01")
  const [endDate, setEndDate] = useState("2025-10-26")
  const [statusFilter, setStatusFilter] = useState<string | null>("all")
  const [paymentFilter, setPaymentFilter] = useState<string | null>("all")

  const filteredTransactions = mockTransactions.filter((t) => {
    const matchesStatus = statusFilter === "all" || t.status === statusFilter
    const matchesPayment = paymentFilter === "all" || t.paymentMethod === paymentFilter
    return matchesStatus && matchesPayment
  })

  const totalTransactions = filteredTransactions.length
  const totalRevenue = filteredTransactions.reduce((sum, t) => sum + t.total, 0)
  const paidCount = filteredTransactions.filter((t) => t.status === "paid").length
  const unpaidCount = filteredTransactions.filter((t) => t.status === "unpaid").length

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "unpaid":
        return "bg-red-100 text-red-800"
      case "saved":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Start Date</label>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">End Date</label>
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Status</label>
            <Select value={statusFilter || "all"} onValueChange={(v) => setStatusFilter(v || "all")}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="unpaid">Unpaid</SelectItem>
                <SelectItem value="saved">Saved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Payment Method</label>
            <Select value={paymentFilter || "all"} onValueChange={(v) => setPaymentFilter(v || "all")}>
              <SelectTrigger>
                <SelectValue placeholder="All Methods" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="E-Wallet">E-Wallet</SelectItem>
                <SelectItem value="QRIS">QRIS</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Transactions</p>
          <p className="text-2xl font-bold text-foreground">{totalTransactions}</p>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-primary">Rp {totalRevenue.toLocaleString("id-ID")}</p>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">Paid</p>
          <p className="text-2xl font-bold text-green-600">{paidCount}</p>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">Unpaid</p>
          <p className="text-2xl font-bold text-red-600">{unpaidCount}</p>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Transaction Details</h3>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction #</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="text-right">Items</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium text-sm">{transaction.transactionNumber}</TableCell>
                  <TableCell className="text-sm">{transaction.date}</TableCell>
                  <TableCell className="text-sm">{transaction.customer}</TableCell>
                  <TableCell className="text-right">{transaction.items}</TableCell>
                  <TableCell className="text-right font-medium">
                    Rp {transaction.total.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell className="text-sm">{transaction.paymentMethod}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(transaction.status)}>{transaction.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
