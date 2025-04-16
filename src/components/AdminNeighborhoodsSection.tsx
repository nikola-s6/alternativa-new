"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Edit, Save } from "lucide-react"

type Neighborhood = {
  id: string
  value: string
  title: string
  responsiblePerson: string
  phone: string
  createdAt: string
  updatedAt: string
}

export default function AdminNeighborhoodSection() {
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [selectedNeighborhoodId, setSelectedNeighborhoodId] = useState<string>("")
  const [form, setForm] = useState({
    responsiblePerson: "",
    phone: "",
  })
  const { toast } = useToast()

  // Fetch neighborhoods
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
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load neighborhoods. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchNeighborhoods()
  }, [toast])

  // Fetch a specific neighborhood when selected for editing
  useEffect(() => {
    if (selectedNeighborhoodId) {
      const fetchNeighborhood = async () => {
        try {
          setIsSaving(true)
          const response = await fetch(`/api/admin/neighborhoods/${selectedNeighborhoodId}`)

          if (!response.ok) {
            throw new Error("Failed to fetch neighborhood")
          }

          const data = await response.json()

          // Set form data
          setForm({
            responsiblePerson: data.responsiblePerson,
            phone: data.phone,
          })

          setIsSaving(false)
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to load neighborhood. Please try again.",
            variant: "destructive",
          })
          setIsSaving(false)
        }
      }

      fetchNeighborhood()
    }
  }, [selectedNeighborhoodId, toast])

  // Handle updating a neighborhood
  const handleUpdateNeighborhood = async () => {
    // Validate inputs
    if (!form.responsiblePerson.trim() || !form.phone.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      const response = await fetch(`/api/admin/neighborhoods/${selectedNeighborhoodId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        throw new Error("Failed to update neighborhood")
      }

      const updatedNeighborhood = await response.json()

      // Update local state
      setNeighborhoods(neighborhoods.map((n) => (n.id === updatedNeighborhood.id ? updatedNeighborhood : n)))

      toast({
        title: "Success",
        description: "Neighborhood updated successfully.",
        variant: 'confirm'
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update neighborhood. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="bg-primary rounded-lg shadow-lg border-8 border-destructive mb-16">
      <div className="w-full bg-destructive p-8">
        <h2 className="text-4xl font-bold text-white mb-6 text-center">Управљање Месним Заједницама</h2>
        <p className="text-white text-lg text-center">Уредите контакт информације за месне заједнице.</p>
      </div>

      <div className="p-8">
        {/* Neighborhoods Table */}
        <div className="mb-8 overflow-hidden bg-white rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Назив
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Одговорно лице
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Телефон
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Акције
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    Учитавање...
                  </td>
                </tr>
              ) : neighborhoods.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    Нема месних заједница.
                  </td>
                </tr>
              ) : (
                neighborhoods.map((neighborhood) => (
                  <tr key={neighborhood.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {neighborhood.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {neighborhood.responsiblePerson}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{neighborhood.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedNeighborhoodId(neighborhood.id)}
                        className="flex items-center gap-1"
                      >
                        <Edit className="h-4 w-4" />
                        Уреди
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Edit Neighborhood Form */}
        {selectedNeighborhoodId ? (
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium mb-4">
              Уреди месну заједницу: {neighborhoods.find((n) => n.id === selectedNeighborhoodId)?.title}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="responsiblePerson" className="block text-sm font-medium text-gray-700 mb-1">
                  Одговорно лице
                </label>
                <Input
                  id="responsiblePerson"
                  value={form.responsiblePerson}
                  onChange={(e) => setForm({ ...form, responsiblePerson: e.target.value })}
                  placeholder="Име и презиме"
                  disabled={isSaving}
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Телефон
                </label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+381 11 123 4567"
                  disabled={isSaving}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setSelectedNeighborhoodId("")} disabled={isSaving}>
                Откажи
              </Button>
              <Button onClick={handleUpdateNeighborhood} disabled={isSaving} className="flex items-center gap-1">
                <Save className="h-4 w-4" />
                {isSaving ? "Чување..." : "Сачувај промене"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
            <p className="text-gray-500">Изаберите месну заједницу из табеле да бисте уредили њене податке.</p>
          </div>
        )}
      </div>
    </div>
  )
}

