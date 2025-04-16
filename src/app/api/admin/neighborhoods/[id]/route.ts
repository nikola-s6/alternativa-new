import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET - Fetch a specific neighborhood
export async function GET(request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Fetch the neighborhood
    const neighborhood = await prisma.neighborhood.findUnique({
      where: { id },
    })

    if (!neighborhood) {
      return NextResponse.json({ error: "Neighborhood not found" }, { status: 404 })
    }

    return NextResponse.json(neighborhood)
  } catch (error) {
    console.error("Error fetching neighborhood:", error)
    return NextResponse.json({ error: "Failed to fetch neighborhood" }, { status: 500 })
  }
}

// PUT - Update a neighborhood
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    // Parse request body
    const body = await request.json()
    const { responsiblePerson, phone } = body

    // Validate input
    if (!responsiblePerson || !phone) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Update the neighborhood
    const updatedNeighborhood = await prisma.neighborhood.update({
      where: { id },
      data: {
        responsiblePerson,
        phone,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(updatedNeighborhood)
  } catch (error) {
    console.error("Error updating neighborhood:", error)
    return NextResponse.json({ error: "Failed to update neighborhood" }, { status: 500 })
  }
}
