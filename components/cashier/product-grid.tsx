"use client"
import ProductCard from "./product-card"
import ProductTable from "./product-table"

interface ProductGridProps {
  searchQuery: string
  viewMode: "grid" | "list"
  selectedCategory: string | null
}

// Mock data - Replace with actual data from store
const mockProducts = [
  {
    id: "1",
    name: "Bakso Sapi",
    price: 25000,
    image: "/placeholder.svg?height=200&width=200",
    stock: 15,
    category: "Food",
  },
  {
    id: "2",
    name: "Es Teh",
    price: 5000,
    image: "/placeholder.svg?height=200&width=200",
    stock: 45,
    category: "Beverage",
  },
  {
    id: "3",
    name: "Nasi Goreng",
    price: 30000,
    image: "/placeholder.svg?height=200&width=200",
    stock: 8,
    category: "Food",
  },
  {
    id: "4",
    name: "Kopi Hitam",
    price: 8000,
    image: "/placeholder.svg?height=200&width=200",
    stock: 50,
    category: "Beverage",
  },
  {
    id: "5",
    name: "Mie Ayam",
    price: 20000,
    image: "/placeholder.svg?height=200&width=200",
    stock: 3,
    category: "Food",
  },
  {
    id: "6",
    name: "Jus Jeruk",
    price: 12000,
    image: "/placeholder.svg?height=200&width=200",
    stock: 25,
    category: "Beverage",
  },
]

export default function ProductGrid({ searchQuery, viewMode, selectedCategory }: ProductGridProps) {
  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || product.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  if (filteredProducts.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-muted-foreground mb-2">No products found</p>
          <p className="text-sm text-muted-foreground">Try adjusting your search</p>
        </div>
      </div>
    )
  }

  if (viewMode === "list") {
    return <ProductTable products={filteredProducts} />
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 auto-rows-max">
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} viewMode={viewMode} />
      ))}
    </div>
  )
}
