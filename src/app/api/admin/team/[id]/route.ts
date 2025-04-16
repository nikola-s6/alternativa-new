import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET - Fetch a specific team member
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    // Fetch the team member
    const teamMember = await prisma.teamMember.findUnique({
      where: { id },
    })

    if (!teamMember) {
      return NextResponse.json({ error: "Team member not found" }, { status: 404 })
    }

    return NextResponse.json(teamMember)
  } catch (error) {
    console.error("Error fetching team member:", error)
    return NextResponse.json({ error: "Failed to fetch team member" }, { status: 500 })
  }
}

// PUT - Update a team member
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    // Parse request body
    const body = await request.json()
    const { name, position, image, biography, order } = body

    // Validate input
    if (!name || !position) {
      return NextResponse.json({ error: "Name and position are required" }, { status: 400 })
    }

    // Update the team member
    const updatedTeamMember = await prisma.teamMember.update({
      where: { id },
      data: {
        name,
        position,
        image: image || null,
        biography: biography || "",
        order: order !== undefined ? order : undefined,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(updatedTeamMember)
  } catch (error) {
    console.error("Error updating team member:", error)
    return NextResponse.json({ error: "Failed to update team member" }, { status: 500 })
  }
}

// DELETE - Delete a team member
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    // Delete the team member
    await prisma.teamMember.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting team member:", error)
    return NextResponse.json({ error: "Failed to delete team member" }, { status: 500 })
  }
}

