"use client"

import type { ReactNode } from "react"
import { useState } from "react"
import Sidebar from "./sidebar"
import LockScreen from "@/components/security/lock-screen"
import NotificationProvider from "@/components/providers/notification-provider"
import { useIsMobile } from "@/hooks/use-mobile"
import { useLockScreenStore } from "@/lib/services/lockScreenService"

interface MainLayoutProps {
  children: ReactNode
  showSidebar?: boolean
}

export default function MainLayout({ children, showSidebar = true }: MainLayoutProps) {
  const isMobile = useIsMobile()
  const { isLocked } = useLockScreenStore()
  const [isUnlocked, setIsUnlocked] = useState(false)

  const handleUnlock = () => {
    setIsUnlocked(true)
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Lock Screen */}
      {isLocked && <LockScreen onUnlock={handleUnlock} />}
      
      {/* Sidebar - Hidden on mobile */}
      {showSidebar && !isMobile && !isLocked && (
        <div className="relative border-r border-border bg-card transition-all duration-300">
          <Sidebar />
        </div>
      )}
      
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <main className="h-full overflow-auto">
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </main>
      </div>
    </div>
  )
}
