"use client"
import { AlertTriangle, TrendingDown, Clock } from "lucide-react"

const mockNotifications = [
  {
    id: "1",
    type: "low_stock",
    title: "Low Stock Alert",
    message: "Daging Sapi: 200gr left",
    timestamp: "5 mins ago",
    icon: AlertTriangle,
  },
  {
    id: "2",
    type: "unpaid",
    title: "Unpaid Transactions",
    message: "3 transactions pending payment",
    timestamp: "2 hours ago",
    icon: TrendingDown,
  },
  {
    id: "3",
    type: "saved_order",
    title: "Saved Orders",
    message: "2 orders waiting to be completed",
    timestamp: "1 day ago",
    icon: Clock,
  },
]

export default function NotificationPanel() {
  return (
    <div className="absolute top-12 right-0 w-80 bg-card border border-border rounded-lg shadow-lg z-50">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-foreground">Notifications</h3>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {mockNotifications.map((notification) => {
          const Icon = notification.icon
          return (
            <div
              key={notification.id}
              className="p-3 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <div className="flex gap-3">
                <div className="flex-shrink-0 mt-1">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground">{notification.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">{notification.timestamp}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="p-3 border-t border-border text-center">
        <a href="#" className="text-xs text-primary hover:underline">
          View all notifications
        </a>
      </div>
    </div>
  )
}
