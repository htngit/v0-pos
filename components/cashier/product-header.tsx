"use client"

import { Bell, Lock, Grid, List, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import NotificationPanel from "@/components/notifications/notification-panel"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search } from "lucide-react"
import SpaceViewModal from "@/components/cashier/space-view-modal"
// TODO: Import and use offline detection hooks
// import { useOffline } from "@/lib/hooks/useOffline"
// import { useAuthStore } from "@/lib/stores/authStore"

interface ProductHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  viewMode: "grid" | "list"
  onViewModeChange: (mode: "grid" | "list") => void
}

export default function ProductHeader({ searchQuery, onSearchChange, viewMode, onViewModeChange }: ProductHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [showSpaceView, setShowSpaceView] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("pos_session")
    window.location.href = "/"
  }

  const handleLockScreen = () => {
    // TODO: Show PIN lock screen
    console.log("Lock screen")
  }

  return (
    <>
      <div className="flex flex-col gap-3 pb-4 border-b border-border">
        {/* Top Row: Online Status, Notifications, Lock, Search, View Mode */}
        <div className="flex items-center justify-between gap-2">
          {/* Online/Offline Indicator */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted flex-shrink-0">
            <div className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-500" : "bg-yellow-500"}`}></div>
            <span className="text-xs text-muted-foreground">{isOnline ? "Online" : "Offline"}</span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 relative mx-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari products..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 h-9"
            />
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Notifications */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
              </Button>
              {showNotifications && <NotificationPanel />}
            </div>

            {/* Lock Screen */}
            <Button variant="ghost" size="icon" onClick={handleLockScreen} title="Lock Screen (Ctrl+L)">
              <Lock className="w-5 h-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  {viewMode === "grid" ? <Grid className="w-4 h-4" /> : <List className="w-4 h-4" />}
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => onViewModeChange("grid")} className="gap-2">
                  <Grid className="w-4 h-4" />
                  Grid View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onViewModeChange("list")} className="gap-2">
                  <List className="w-4 h-4" />
                  List View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowSpaceView(true)} className="gap-2">
                  <Grid className="w-4 h-4" />
                  Space View
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <SpaceViewModal isOpen={showSpaceView} onClose={() => setShowSpaceView(false)} />
    </>
  )
}
