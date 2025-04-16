import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET - Fetch all neighborhoods (admin)
export async function GET() {
  try {
    // Fetch neighborhoods from database
    const neighborhoods = await prisma.neighborhood.findMany({
      orderBy: {
        title: "asc",
      },
    })

    return NextResponse.json(neighborhoods)
  } catch (error) {
    console.error("Error fetching neighborhoods:", error)
    return NextResponse.json({ error: "Failed to fetch neighborhoods" }, { status: 500 })
  }
}
