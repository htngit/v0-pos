"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingCart, Package, Boxes, Users, BarChart3, Settings, ChevronLeft, Maximize2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const menuItems = [
  {
    label: "Kasir",
    icon: ShoppingCart,
    href: "/cashier",
  },
  {
    label: "Produk",
    icon: Package,
    href: "/products",
  },
  {
    label: "Inventory",
    icon: Boxes,
    href: "/inventory",
  },
  {
    label: "Pelanggan",
    icon: Users,
    href: "/customers",
  },
  {
    label: "Laporan",
    icon: BarChart3,
    href: "/reports",
  },
  {
    label: "Pengaturan",
    icon: Settings,
    href: "/settings",
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null)
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <nav className={cn("flex flex-col h-full p-4 gap-4 transition-all duration-300", isCollapsed ? "w-20" : "w-64")}>
      {/* Header with collapse button */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className={cn("flex items-center gap-3", isCollapsed && "justify-center w-full")}>
          {!isCollapsed && (
            <div className="flex flex-col">
              <h2 className="font-semibold text-sm text-foreground">POS</h2>
              <p className="text-xs text-muted-foreground">Offline System</p>
            </div>
          )}
          {isCollapsed && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 h-8 w-8"
              title="Expand sidebar"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          )}
        </div>
        {!isCollapsed && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 h-8 w-8"
            title="Collapse sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Menu Items */}
      <div className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.href)

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 transition-all duration-300",
                  isActive && "bg-primary text-primary-foreground",
                  isCollapsed && "justify-center p-2",
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </Button>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
