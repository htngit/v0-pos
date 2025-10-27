"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle } from "lucide-react"

export default function CloseCashierReport() {
  const [actualCash, setActualCash] = useState("")
  const [notes, setNotes] = useState("")

  // Mock data
  const openingBalance = 500000
  const totalCash = 2850000
  const totalNonCash = 1200000
  const totalSales = 4050000
  const expectedCash = openingBalance + totalCash

  const variance = actualCash ? Number(actualCash) - expectedCash : 0
  const variancePercent = actualCash ? ((variance / expectedCash) * 100).toFixed(2) : 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Closing cashier:", { actualCash, notes, variance })
  }

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">Opening Balance</p>
          <p className="text-2xl font-bold text-foreground">Rp {openingBalance.toLocaleString("id-ID")}</p>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Cash Sales</p>
          <p className="text-2xl font-bold text-primary">Rp {totalCash.toLocaleString("id-ID")}</p>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Non-Cash</p>
          <p className="text-2xl font-bold text-foreground">Rp {totalNonCash.toLocaleString("id-ID")}</p>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Sales</p>
          <p className="text-2xl font-bold text-foreground">Rp {totalSales.toLocaleString("id-ID")}</p>
        </Card>
      </div>

      {/* Close Form */}
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Expected vs Actual */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Expected Cash</label>
              <Input value={`Rp ${expectedCash.toLocaleString("id-ID")}`} disabled className="bg-muted" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Actual Cash Count *</label>
              <Input
                type="number"
                value={actualCash}
                onChange={(e) => setActualCash(e.target.value)}
                placeholder="Enter actual cash amount"
                required
              />
            </div>
          </div>

          {/* Variance Display */}
          {actualCash && (
            <div
              className={`p-4 rounded-lg border-2 ${variance >= 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
            >
              <div className="flex items-start gap-3">
                <AlertCircle className={`w-5 h-5 flex-shrink-0 ${variance >= 0 ? "text-green-600" : "text-red-600"}`} />
                <div>
                  <p className={`font-semibold ${variance >= 0 ? "text-green-900" : "text-red-900"}`}>
                    Variance: {variance >= 0 ? "+" : ""}Rp {Math.abs(variance).toLocaleString("id-ID")} (
                    {variancePercent}%)
                  </p>
                  <p className={`text-sm ${variance >= 0 ? "text-green-700" : "text-red-700"}`}>
                    {variance >= 0 ? "Cash surplus" : "Cash shortage"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this close cashier..."
              className="w-full h-24 p-3 border border-border rounded-lg bg-background text-foreground"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end pt-4 border-t border-border">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={!actualCash}>
              Close Cashier
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
