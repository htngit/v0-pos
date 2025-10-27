"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import CashierPage from "@/components/pages/cashier-page"
import LoginPage from "@/components/pages/login-page"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated (from localStorage/session)
    const checkAuth = () => {
      const session = localStorage.getItem("pos_session")
      setIsAuthenticated(!!session)
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return isAuthenticated ? <CashierPage /> : <LoginPage />
}
