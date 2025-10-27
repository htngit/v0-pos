"use client"

import { useState } from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import MainLayout from "@/components/layout/main-layout"
import ProductGrid from "@/components/cashier/product-grid"
import ProductHeader from "@/components/cashier/product-header"
import SummaryOrder from "@/components/cashier/summary-order"

export default function CashierPage() {
  const isMobile = useIsMobile()
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  return (
    <MainLayout>
      <div className="flex h-full gap-0">
        {/* Main Content - Products Column */}
        <div className="flex-1 flex flex-col gap-4 p-4 overflow-hidden">
          <ProductHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {/* Product Grid */}
          <div className="flex-1 overflow-auto">
            <ProductGrid searchQuery={searchQuery} viewMode={viewMode} selectedCategory={selectedCategory} />
          </div>
        </div>

        {/* Order Summary - Sidebar on desktop, modal on mobile */}
        {!isMobile && (
          <div className="w-80 h-full border-l border-border flex-shrink-0">
            <SummaryOrder />
          </div>
        )}
      </div>
    </MainLayout>
  )
}
