"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import useEmblaCarousel from "embla-carousel-react"
import Link from "next/link"
import type { TeamMember } from "@/app/api/team/route"
import { Skeleton } from "@/components/ui/skeleton"

const TeamMemberCard: React.FC<TeamMember & { index: number }> = ({ name, image, position, index, id }) => (
  <div className="flex-shrink-0 w-64 mx-2 sm:mx-3 cursor-grab active:cursor-grabbing">
    <Link href={`/team?member=${id}`}>
      <div className="relative w-full h-64 mb-4 overflow-hidden rounded-lg border-4 border-white shadow-lg">
        {image ? (
          <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
            <svg
              className="w-32 h-32 text-gray-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
    </Link>
    <h3 className="text-xl font-semibold text-white text-center">{name}</h3>
    <p className="text-sm text-gray-300 text-center leading-none">{position}</p>
  </div>
)

export function TeamSection() {
  const [windowWidth, setWindowWidth] = useState(0)
  const wrapper = useRef<HTMLDivElement>(null)
  const [useEmbla, setUseEmbla] = useState(false)
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    slidesToScroll: 1,
    containScroll: "trimSnaps",
    dragFree: true,
    skipSnaps: true,
  })

  // Add state for team members and loading
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch team members from API
  useEffect(() => {
    async function fetchTeamMembers() {
      try {
        const response = await fetch("/api/team")
        if (!response.ok) {
          throw new Error("Failed to fetch team members")
        }
        const data = await response.json()
        // Sort team members by order
        const sortedData = [...data].sort((a, b) => a.order - b.order)
        setTeamMembers(sortedData)
      } catch (error) {
        console.error("Error fetching team members:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTeamMembers()
  }, [])

  const handleResize = () => {
    if (wrapper.current) setWindowWidth(wrapper.current.clientWidth)
  }

  useEffect(() => {
    const checkEmbla = () => {
      if (wrapper.current) {
        setUseEmbla(!(windowWidth > teamMembers.length * 272))
      }
    }
    handleResize()

    checkEmbla()
    if (emblaApi) {
      let intervalId: NodeJS.Timeout

      const startAutoplay = () => {
        intervalId = setInterval(() => {
          emblaApi.scrollNext()
        }, 3000)
      }

      const stopAutoplay = () => {
        clearInterval(intervalId)
      }

      startAutoplay()

      emblaApi.on("pointerDown", stopAutoplay)
      emblaApi.on("pointerUp", startAutoplay)

      return () => {
        stopAutoplay()
        emblaApi.off("pointerDown", stopAutoplay)
        emblaApi.off("pointerUp", startAutoplay)
      }
    }
  }, [emblaApi, windowWidth, teamMembers.length])

  useEffect(() => {

    handleResize()

    window.addEventListener("resize", handleResize, false)
    window.addEventListener("orientationchange", handleResize, false)

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("orientationchange", handleResize)
    }
  }, [])

  // Loading skeleton
  if (isLoading) {
    return (
      <section
        className="py-16 relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0,51,110,0.95), rgba(0,51,110,0.8)), url('/cukarica/slika2.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-center mb-12 text-white">НАШ ТИМ</h2>
          <div className="flex justify-center gap-4">
            {Array(5)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="flex-shrink-0 w-64 mx-2 sm:mx-3">
                  <Skeleton className="w-full h-64 mb-4 rounded-lg" />
                  <Skeleton className="w-3/4 h-6 mx-auto mb-2" />
                  <Skeleton className="w-1/2 h-4 mx-auto" />
                </div>
              ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      className="py-16 relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(0,51,110,0.95), rgba(0,51,110,0.8)), url('/cukarica/slika2.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-extrabold text-center mb-12 text-white">НАШ ТИМ</h2>
        <div ref={wrapper} className="w-full">
          {useEmbla ? (
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex">
                {teamMembers.map((member, index) => (
                  <TeamMemberCard index={index} key={member.id} {...member} />
                ))}
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-center">
              {teamMembers.map((member, index) => (
                <TeamMemberCard index={index} key={member.id} {...member} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

