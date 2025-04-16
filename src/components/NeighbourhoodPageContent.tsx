"use client"

import { useEffect, useState } from "react"
import SecondaryHeader from "@/components/SecondaryHeader"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { normalizeStringForSearch } from "@/lib/helpers"
import { useSearchParams } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"

// Define the Neighborhood type
type Neighborhood = {
  id: string
  value: string
  title: string
  responsiblePerson: string
  phone: string
}

// Skeleton component for neighborhood cards
function NeighborhoodSkeleton() {
  return (
    <div className="bg-white/10 rounded-lg p-6 border border-white/20">
      <Skeleton className="h-6 w-3/4 bg-white/20 mb-4" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full bg-white/20" />
        <Skeleton className="h-4 w-2/3 bg-white/20" />
      </div>
    </div>
  )
}

export default function NeighborhoodPageContent() {
  const searchParams = useSearchParams()
  const mzParam = searchParams.get("mesnaZajednica")

  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  // Fetch neighborhoods from the API
  useEffect(() => {
    const fetchNeighborhoods = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/neighborhoods")

        if (!response.ok) {
          throw new Error("Failed to fetch neighborhoods")
        }

        const data = await response.json()
        setNeighborhoods(data)

        // Set initial search term if mesnaZajednica parameter exists
        if (mzParam) {
          const mz = data.find((m: Neighborhood) => m.value === mzParam)
          if (mz) {
            setSearchTerm(mz.title)
          }
        }
      } catch (err) {
        console.error("Error fetching neighborhoods:", err)
        setError("Грешка при учитавању месних заједница. Молимо покушајте поново.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchNeighborhoods()
  }, [mzParam])

  // Filter neighborhoods based on search term
  const filteredNeighborhoods = neighborhoods.filter((neighborhood) => {
    const normalizedSearch = normalizeStringForSearch(searchTerm)
    return (
      normalizeStringForSearch(neighborhood.title).includes(normalizedSearch) ||
      normalizeStringForSearch(neighborhood.responsiblePerson).includes(normalizedSearch)
    )
  })

  return (
    <main>
      <SecondaryHeader title="Месне заједнице" />

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-primary rounded-lg shadow-lg border-8 border-destructive mb-8">
              <div className="w-full bg-destructive p-8">
                <h2 className="text-4xl font-bold text-white mb-6 text-center">ЧУКАРИЦА НА ПРВОМ МЕСТУ</h2>
                <p className="text-white text-lg text-center">
                  Наш одговорна лица месних заједница су ту за вас. Контактирајте их за сва питања и предлоге.
                </p>
              </div>

              <div className="p-8">
                <div className="relative mb-8">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Претражите месну заједницу или име одговорног лица..."
                    className="pl-10 bg-white/10 text-white placeholder:text-gray-400 border-white/20"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Display 6 skeleton cards while loading */}
                    {[...Array(6)].map((_, index) => (
                      <NeighborhoodSkeleton key={index} />
                    ))}
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <p className="text-red-300">{error}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredNeighborhoods.length === 0 ? (
                      <div className="col-span-2 text-center py-8">
                        <p className="text-white">Нема резултата за вашу претрагу.</p>
                      </div>
                    ) : (
                      filteredNeighborhoods.map((neighborhood) => (
                        <div
                          key={neighborhood.id}
                          className="bg-white/10 rounded-lg p-6 border border-white/20 hover:bg-white/20 transition-colors"
                        >
                          <h3 className="text-xl font-bold text-white mb-2">{neighborhood.title}</h3>
                          <div className="text-gray-200 mb-4">
                            <p className="mb-1">
                              <span className="font-semibold">Одговорно лице:</span> {neighborhood.responsiblePerson}
                            </p>
                            <p>
                              <span className="font-semibold">Телефон:</span> {neighborhood.phone}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="text-center">
              <p className="text-primary mb-4">Уколико имате додатна питања можете нас контактирати путем форме.</p>
              <Link href="/contact">
                <Button className="font-bold" variant="destructive">
                  Прикључи се
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

