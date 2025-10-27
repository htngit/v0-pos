"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Trash2, Archive } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function DataHealth() {
  const [stats, setStats] = useState({
    totalProducts: 45,
    totalTransactions: 1250,
    totalCustomers: 89,
    databaseSize: "12.5 MB",
    lastBackup: "2025-10-26 10:30",
  })

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleArchiveOldData = () => {
    console.log("Archiving old data...")
  }

  const handleOptimizeDatabase = () => {
    console.log("Optimizing database...")
  }

  const handleDeleteAllData = () => {
    if (showDeleteConfirm) {
      console.log("Deleting all data...")
      setShowDeleteConfirm(false)
    } else {
      setShowDeleteConfirm(true)
    }
  }

  return (
    <div className="space-y-4">
      {/* Database Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground mb-1">Total Products</p>
          <p className="text-2xl font-bold text-foreground">{stats.totalProducts}</p>
        </Card>

        <Card className="p-4">
          <p className="text-xs text-muted-foreground mb-1">Total Transactions</p>
          <p className="text-2xl font-bold text-foreground">{stats.totalTransactions}</p>
        </Card>

        <Card className="p-4">
          <p className="text-xs text-muted-foreground mb-1">Total Customers</p>
          <p className="text-2xl font-bold text-foreground">{stats.totalCustomers}</p>
        </Card>

        <Card className="p-4">
          <p className="text-xs text-muted-foreground mb-1">Database Size</p>
          <p className="text-2xl font-bold text-foreground">{stats.databaseSize}</p>
        </Card>

        <Card className="p-4">
          <p className="text-xs text-muted-foreground mb-1">Last Backup</p>
          <p className="text-sm font-bold text-foreground">{stats.lastBackup}</p>
        </Card>
      </div>

      {/* Maintenance Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Database Maintenance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Archive className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-medium text-foreground">Archive Old Data</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Archive transactions older than 1 year to reduce database size
                </p>
              </div>
              <Button onClick={handleArchiveOldData} variant="outline" size="sm" className="bg-transparent">
                Archive
              </Button>
            </div>

            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-medium text-foreground">Optimize Database</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Optimize database performance and clean up unused space
                </p>
              </div>
              <Button onClick={handleOptimizeDatabase} variant="outline" size="sm" className="bg-transparent">
                Optimize
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50 bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>These actions are irreversible. Please proceed with caution.</AlertDescription>
          </Alert>

          {showDeleteConfirm ? (
            <div className="p-4 bg-destructive/10 border border-destructive/50 rounded-lg space-y-3">
              <p className="text-sm font-medium text-destructive">
                Are you sure you want to delete all data? This action cannot be undone.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="bg-transparent"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                  onClick={handleDeleteAllData}
                >
                  Confirm Delete
                </Button>
              </div>
            </div>
          ) : (
            <Button
              onClick={handleDeleteAllData}
              variant="outline"
              className="text-destructive hover:text-destructive gap-2 bg-transparent"
            >
              <Trash2 className="w-4 h-4" />
              Delete All Data
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
