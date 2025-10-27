"use client"

import type { ReactNode } from "react"
import Sidebar from "./sidebar"
import { useIsMobile } from "@/hooks/use-mobile"

interface MainLayoutProps {
  children: ReactNode
  showSidebar?: boolean
}

export default function MainLayout({ children, showSidebar = true }: MainLayoutProps) {
  const isMobile = useIsMobile()

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - Hidden on mobile */}
      {showSidebar && !isMobile && (
        <div className="relative border-r border-border bg-card transition-all duration-300">
          <Sidebar />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <main className="h-full overflow-auto">{children}</main>
      </div>
    </div>
  )
}
