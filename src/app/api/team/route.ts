import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export type TeamMember = {
  id: string
  name: string
  image: string | null
  position: string
  biography: string
  order: number
  createdAt: string
  updatedAt: string
}


// GET - Fetch all team members
export async function GET() {
  try {
    // Fetch team members from database, ordered by the 'order' field
    const teamMembers = await prisma.teamMember.findMany({
      orderBy: {
        order: "asc",
      },
    })

    return NextResponse.json(teamMembers)
  } catch (error) {
    console.error("Error fetching team members:", error)
    return NextResponse.json({ error: "Failed to fetch team members" }, { status: 500 })
  }
}
