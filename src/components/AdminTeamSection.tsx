"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash, MoveUp, MoveDown } from "lucide-react"
import ImageUploader from "@/components/ImageUploader"

type TeamMember = {
  id: string
  name: string
  position: string
  image: string | null
  biography: string
  order: number
  createdAt: string
  updatedAt: string
}

export default function AdminTeamSection() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [selectedMemberId, setSelectedMemberId] = useState<string>("")
  const [mode, setMode] = useState<"create" | "edit" | "delete">("create")
  const [form, setForm] = useState({
    name: "",
    position: "",
    image: "",
    biography: "",
    order: 0,
  })
  const { toast } = useToast()

  // Fetch team members
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/team")

        if (!response.ok) {
          throw new Error("Failed to fetch team members")
        }

        const data = await response.json()
        setTeamMembers(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load team members. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTeamMembers()
  }, [toast])

  // Fetch a specific team member when selected for editing
  useEffect(() => {
    if (mode === "edit" && selectedMemberId) {
      const fetchTeamMember = async () => {
        try {
          setIsSaving(true)
          const response = await fetch(`/api/admin/team/${selectedMemberId}`)

          if (!response.ok) {
            throw new Error("Failed to fetch team member")
          }

          const data = await response.json()

          // Set form data
          setForm({
            name: data.name,
            position: data.position,
            image: data.image || "",
            biography: data.biography,
            order: data.order,
          })

          setIsSaving(false)
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to load team member. Please try again.",
            variant: "destructive",
          })
          setIsSaving(false)
        }
      }

      fetchTeamMember()
    }
  }, [selectedMemberId, mode, toast])

  // Reset form when changing mode
  useEffect(() => {
    if (mode === "create") {
      // Set default order to the end of the list
      const nextOrder = teamMembers.length > 0 ? Math.max(...teamMembers.map((member) => member.order)) + 1 : 0

      setForm({
        name: "",
        position: "",
        image: "",
        biography: "",
        order: nextOrder,
      })
      setSelectedMemberId("")
    }
  }, [mode, teamMembers])

  // Handle creating a new team member
  const handleCreateTeamMember = async () => {
    // Validate inputs
    if (!form.name.trim() || !form.position.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both name and position fields.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      const response = await fetch("/api/admin/team", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          order: Number.parseInt(form.order.toString(), 10), // Ensure order is a number
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create team member")
      }

      const addedMember = await response.json()

      // Update local state
      setTeamMembers([...teamMembers, addedMember])

      // Reset form with a new default order
      const nextOrder = Math.max(...[...teamMembers, addedMember].map((member) => member.order)) + 1

      setForm({
        name: "",
        position: "",
        image: "",
        biography: "",
        order: nextOrder,
      })

      toast({
        title: "Success",
        description: "Team member created successfully.",
        variant: 'confirm'
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create team member. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Handle updating a team member
  const handleUpdateTeamMember = async () => {
    // Validate inputs
    if (!form.name.trim() || !form.position.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both name and position fields.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      const response = await fetch(`/api/admin/team/${selectedMemberId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          order: Number.parseInt(form.order.toString(), 10), // Ensure order is a number
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update team member")
      }

      const updatedMember = await response.json()

      // Update local state
      setTeamMembers(teamMembers.map((member) => (member.id === updatedMember.id ? updatedMember : member)))

      toast({
        title: "Success",
        description: "Team member updated successfully.",
        variant: 'confirm'
      })

      // Reset form and selection
      const nextOrder = Math.max(...teamMembers.map((member) => member.order)) + 1

      setForm({
        name: "",
        position: "",
        image: "",
        biography: "",
        order: nextOrder,
      })
      setSelectedMemberId("")
      setMode("create")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update team member. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Handle deleting a team member
  const handleDeleteTeamMember = async () => {
    if (!selectedMemberId) {
      toast({
        title: "Error",
        description: "Please select a team member to delete.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/admin/team/${selectedMemberId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete team member")
      }

      // Update local state
      setTeamMembers(teamMembers.filter((member) => member.id !== selectedMemberId))

      // Reset selection
      setSelectedMemberId("")

      toast({
        title: "Success",
        description: "Team member deleted successfully.",
        variant: 'confirm'
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete team member. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle reordering team members
  const handleReorderTeamMember = async (id: string, direction: "up" | "down") => {
    const currentIndex = teamMembers.findIndex((member) => member.id === id)
    if (currentIndex === -1) return

    // Can't move first item up or last item down
    if (
      (direction === "up" && currentIndex === 0) ||
      (direction === "down" && currentIndex === teamMembers.length - 1)
    ) {
      return
    }

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1
    const newOrder = [...teamMembers]

    // Swap the items
    const temp = newOrder[currentIndex]
    newOrder[currentIndex] = newOrder[newIndex]
    newOrder[newIndex] = temp

    // Update the order property for the affected items
    const updatedMembers = newOrder.map((member, index) => ({
      ...member,
      order: index,
    }))

    // Update UI immediately
    setTeamMembers(updatedMembers)

    // Update the two affected members in the database
    try {
      const promises = [currentIndex, newIndex].map((index) =>
        fetch(`/api/admin/team/${updatedMembers[index].id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...updatedMembers[index],
            order: updatedMembers[index].order,
          }),
        }),
      )

      await Promise.all(promises)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update team member order. Please try again.",
        variant: "destructive",
      })

      // Revert the UI if there was an error
      const fetchTeamMembers = async () => {
        const response = await fetch("/api/admin/team")
        if (response.ok) {
          const data = await response.json()
          setTeamMembers(data)
        }
      }
      fetchTeamMembers()
    }
  }

  // Get the sorted team members
  const sortedTeamMembers = [...teamMembers].sort((a, b) => a.order - b.order)

  return (
    <div className="bg-primary rounded-lg shadow-lg border-8 border-destructive mb-16">
      <div className="w-full bg-destructive p-8">
        <h2 className="text-4xl font-bold text-white mb-6 text-center">Управљање Тимом</h2>
        <p className="text-white text-lg text-center">
          Додајте, уредите или обришите чланове тима који се приказују на сајту.
        </p>
      </div>

      <div className="p-8">
        {/* Team Members Table */}
        <div className="mb-8 overflow-hidden bg-white rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Редослед
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Име
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Позиција
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Слика
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
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    Учитавање...
                  </td>
                </tr>
              ) : sortedTeamMembers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    Нема чланова тима. Додајте новог члана испод.
                  </td>
                </tr>
              ) : (
                sortedTeamMembers.map((member, index) => (
                  <tr key={member.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <span>{member.order}</span>
                        <div className="flex flex-col">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReorderTeamMember(member.id, "up")}
                            disabled={index === 0}
                            className="h-6 w-6 p-0"
                          >
                            <MoveUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReorderTeamMember(member.id, "down")}
                            disabled={index === sortedTeamMembers.length - 1}
                            className="h-6 w-6 p-0"
                          >
                            <MoveDown className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.position}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.image ? "Yes" : "No"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedMemberId(member.id)
                            setMode("edit")
                          }}
                          className="flex items-center gap-1"
                        >
                          <Edit className="h-4 w-4" />
                          Уреди
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setSelectedMemberId(member.id)
                            setMode("delete")
                          }}
                          className="flex items-center gap-1"
                        >
                          <Trash className="h-4 w-4" />
                          Обриши
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Team Member Management */}
        <Tabs
          defaultValue="create"
          value={mode}
          onValueChange={(value) => setMode(value as "create" | "edit" | "delete")}
        >
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Креирај
            </TabsTrigger>
            <TabsTrigger value="edit" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Уреди
            </TabsTrigger>
            <TabsTrigger value="delete" className="flex items-center gap-2">
              <Trash className="h-4 w-4" />
              Обриши
            </TabsTrigger>
          </TabsList>

          {/* Create Team Member Tab */}
          <TabsContent value="create">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="name" className="block text-sm font-medium text-white mb-1">
                    Име и презиме
                  </label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Унесите име и презиме"
                    className="bg-white/10 text-white placeholder:text-gray-400 border-white/20"
                    disabled={isSaving}
                  />
                </div>
                <div>
                  <label htmlFor="order" className="block text-sm font-medium text-white mb-1">
                    Редослед
                  </label>
                  <Input
                    id="order"
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: Number.parseInt(e.target.value, 10) || 0 })}
                    placeholder="Редослед приказивања"
                    className="bg-white/10 text-white placeholder:text-gray-400 border-white/20"
                    disabled={isSaving}
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="position" className="block text-sm font-medium text-white mb-1">
                  Позиција
                </label>
                <Input
                  id="position"
                  value={form.position}
                  onChange={(e) => setForm({ ...form, position: e.target.value })}
                  placeholder="Унесите позицију"
                  className="bg-white/10 text-white placeholder:text-gray-400 border-white/20"
                  disabled={isSaving}
                />
              </div>

              <div>
                <ImageUploader
                  value={form.image}
                  onChange={(value) => setForm({ ...form, image: value })}
                  label="Слика (опционо)"
                />
              </div>

              <div>
                <label htmlFor="biography" className="block text-sm font-medium text-white mb-1">
                  Биографија
                </label>
                <Textarea
                  id="biography"
                  value={form.biography}
                  onChange={(e) => setForm({ ...form, biography: e.target.value })}
                  placeholder="Унесите биографију"
                  className="bg-white/10 text-white placeholder:text-gray-400 border-white/20 min-h-[200px]"
                  disabled={isSaving}
                />
              </div>

              <Button onClick={handleCreateTeamMember} disabled={isSaving} className="w-full" variant='destructive'>
                {isSaving ? "Креирање..." : "Креирај члана тима"}
              </Button>
            </div>
          </TabsContent>

          {/* Edit Team Member Tab */}
          <TabsContent value="edit">
            <div className="space-y-6">
              <div>
                <label htmlFor="selectMemberToEdit" className="block text-sm font-medium text-white mb-1">
                  Изаберите члана тима за уређивање
                </label>
                <Select value={selectedMemberId} onValueChange={setSelectedMemberId}>
                  <SelectTrigger className="bg-white/10 text-white border-white/20">
                    <SelectValue placeholder="Изаберите члана тима" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoading ? (
                      <SelectItem value="loading" disabled>
                        Учитавање...
                      </SelectItem>
                    ) : sortedTeamMembers.length === 0 ? (
                      <SelectItem value="empty" disabled>
                        Нема чланова тима
                      </SelectItem>
                    ) : (
                      sortedTeamMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name} - {member.position}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {selectedMemberId && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label htmlFor="editName" className="block text-sm font-medium text-white mb-1">
                        Име и презиме
                      </label>
                      <Input
                        id="editName"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Унесите име и презиме"
                        className="bg-white/10 text-white placeholder:text-gray-400 border-white/20"
                        disabled={isSaving}
                      />
                    </div>
                    <div>
                      <label htmlFor="editOrder" className="block text-sm font-medium text-white mb-1">
                        Редослед
                      </label>
                      <Input
                        id="editOrder"
                        type="number"
                        value={form.order}
                        onChange={(e) => setForm({ ...form, order: Number.parseInt(e.target.value, 10) || 0 })}
                        placeholder="Редослед приказивања"
                        className="bg-white/10 text-white placeholder:text-gray-400 border-white/20"
                        disabled={isSaving}
                        min="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="editPosition" className="block text-sm font-medium text-white mb-1">
                      Позиција
                    </label>
                    <Input
                      id="editPosition"
                      value={form.position}
                      onChange={(e) => setForm({ ...form, position: e.target.value })}
                      placeholder="Унесите позицију"
                      className="bg-white/10 text-white placeholder:text-gray-400 border-white/20"
                      disabled={isSaving}
                    />
                  </div>

                  <div>
                    <ImageUploader
                      value={form.image}
                      onChange={(value) => setForm({ ...form, image: value })}
                      label="Слика (опционо)"
                    />
                  </div>

                  <div>
                    <label htmlFor="editBiography" className="block text-sm font-medium text-white mb-1">
                      Биографија
                    </label>
                    <Textarea
                      id="editBiography"
                      value={form.biography}
                      onChange={(e) => setForm({ ...form, biography: e.target.value })}
                      placeholder="Унесите биографију"
                      className="bg-white/10 text-white placeholder:text-gray-400 border-white/20 min-h-[200px]"
                      disabled={isSaving}
                    />
                  </div>

                  <Button onClick={handleUpdateTeamMember} disabled={isSaving} className="w-full" variant='destructive'>
                    {isSaving ? "Ажурирање..." : "Ажурирај члана тима"}
                  </Button>
                </>
              )}
            </div>
          </TabsContent>

          {/* Delete Team Member Tab */}
          <TabsContent value="delete">
            <div className="space-y-6">
              <div>
                <label htmlFor="selectMemberToDelete" className="block text-sm font-medium text-white mb-1">
                  Изаберите члана тима за брисање
                </label>
                <Select value={selectedMemberId} onValueChange={setSelectedMemberId}>
                  <SelectTrigger className="bg-white/10 text-white border-white/20">
                    <SelectValue placeholder="Изаберите члана тима" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoading ? (
                      <SelectItem value="loading" disabled>
                        Учитавање...
                      </SelectItem>
                    ) : sortedTeamMembers.length === 0 ? (
                      <SelectItem value="empty" disabled>
                        Нема чланова тима
                      </SelectItem>
                    ) : (
                      sortedTeamMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name} - {member.position}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {selectedMemberId && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <h4 className="text-lg font-medium text-red-800 mb-2">Потврда брисања</h4>
                  <p className="text-red-700 mb-4">
                    Да ли сте сигурни да желите да обришете изабраног члана тима? Ова акција се не може поништити.
                  </p>
                  <Button variant="destructive" onClick={handleDeleteTeamMember} className="w-full">
                    Обриши члана тима
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

