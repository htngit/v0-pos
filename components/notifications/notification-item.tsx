"use client"

import { AlertTriangle, TrendingDown, Clock, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NotificationItemProps {
  id: string
  type: "low_stock" | "unpaid" | "saved_order"
  title: string
  message: string
  timestamp: string
  onDismiss: (id: string) => void
}

export default function NotificationItem({ id, type, title, message, timestamp, onDismiss }: NotificationItemProps) {
  const getIcon = () => {
    switch (type) {
      case "low_stock":
        return <AlertTriangle className="w-5 h-5 text-red-600" />
      case "unpaid":
        return <TrendingDown className="w-5 h-5 text-orange-600" />
      case "saved_order":
        return <Clock className="w-5 h-5 text-blue-600" />
      default:
        return null
    }
  }

  return (
    <div className="p-4 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors">
      <div className="flex gap-3">
        <div className="flex-shrink-0 mt-1">{getIcon()}</div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground mt-1">{message}</p>
          <p className="text-xs text-muted-foreground mt-2">{timestamp}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => onDismiss(id)} className="flex-shrink-0 h-6 w-6 p-0">
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
