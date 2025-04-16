import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// POST - Create a new team member
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()
    const { name, position, image, biography, order } = body

    // Validate input
    if (!name || !position) {
      return NextResponse.json({ error: "Name and position are required" }, { status: 400 })
    }

    // Create new team member
    const teamMember = await prisma.teamMember.create({
      data: {
        name,
        position,
        image: image || null,
        biography: biography || "",
        order: order || 0,
      },
    })

    return NextResponse.json(teamMember)
  } catch (error) {
    console.error("Error creating team member:", error)
    return NextResponse.json({ error: "Failed to create team member" }, { status: 500 })
  }
}

