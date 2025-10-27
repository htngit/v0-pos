"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import NotificationItem from "./notification-item"

interface Notification {
  id: string
  type: "low_stock" | "unpaid" | "saved_order"
  title: string
  message: string
  timestamp: string
  read: boolean
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "low_stock",
    title: "Low Stock Alert",
    message: "Daging Sapi: 200gr left",
    timestamp: "5 mins ago",
    read: false,
  },
  {
    id: "2",
    type: "unpaid",
    title: "Unpaid Transactions",
    message: "3 transactions pending payment",
    timestamp: "2 hours ago",
    read: false,
  },
  {
    id: "3",
    type: "saved_order",
    title: "Saved Orders",
    message: "2 orders waiting to be completed",
    timestamp: "1 day ago",
    read: true,
  },
]

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState(mockNotifications)

  const unreadCount = notifications.filter((n) => !n.read).length
  const unreadNotifications = notifications.filter((n) => !n.read)
  const readNotifications = notifications.filter((n) => n.read)

  const handleDismiss = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const handleClearAll = () => {
    setNotifications([])
  }

  return (
    <Card className="w-full max-w-2xl">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold text-foreground">
          Notifications{" "}
          {unreadCount > 0 && (
            <span className="text-xs bg-destructive text-destructive-foreground rounded-full px-2 py-1 ml-2">
              {unreadCount}
            </span>
          )}
        </h3>
        {notifications.length > 0 && (
          <Button variant="ghost" size="sm" onClick={handleClearAll} className="text-xs">
            Clear All
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-muted-foreground">No notifications</p>
        </div>
      ) : (
        <Tabs defaultValue="unread" className="w-full">
          <TabsList className="w-full justify-start border-b border-border rounded-none bg-transparent p-0">
            <TabsTrigger
              value="unread"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              Unread ({unreadCount})
            </TabsTrigger>
            <TabsTrigger
              value="all"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              All ({notifications.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="unread" className="mt-0">
            {unreadNotifications.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">No unread notifications</p>
              </div>
            ) : (
              unreadNotifications.map((notification) => (
                <NotificationItem key={notification.id} {...notification} onDismiss={handleDismiss} />
              ))
            )}
          </TabsContent>

          <TabsContent value="all" className="mt-0">
            {notifications.map((notification) => (
              <NotificationItem key={notification.id} {...notification} onDismiss={handleDismiss} />
            ))}
          </TabsContent>
        </Tabs>
      )}
    </Card>
  )
}
