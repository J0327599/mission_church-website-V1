"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Heart, Calendar, Clock, MapPin, ArrowLeft } from "lucide-react"
import { getEventById, addRegistration, isEventFull, getRegistrationCountByEventId } from "@/lib/data-utils"
import type { Event } from "@/lib/types"

export default function EventRegistration({ params }: { params: { eventId: string } }) {
  const [event, setEvent] = useState<Event | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEventClosed, setIsEventClosed] = useState(false)
  const [registrationCount, setRegistrationCount] = useState(0)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    numberOfAttendees: 1,
    specialRequests: "",
  })
  const router = useRouter()

  useEffect(() => {
    const loadEvent = async () => {
      try {
        setIsLoading(true)
        const eventData = await getEventById(params.eventId)

        if (!eventData) {
          router.push("/")
          return
        }

        if (!eventData.registrationEnabled) {
          setIsEventClosed(true)
        } else {
          const isFull = await isEventFull(params.eventId)
          if (isFull) {
            setIsEventClosed(true)
          }
        }

        const count = await getRegistrationCountByEventId(params.eventId)
        setRegistrationCount(count)

        setEvent(eventData)
      } catch (error) {
        console.error("Failed to load event:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadEvent()
  }, [params.eventId, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: Number.parseInt(value) || 1 }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!event) return

    try {
      // Check if event is full before submitting
      const isFull = await isEventFull(params.eventId)
      if (isFull) {
        setIsEventClosed(true)
        return
      }

      await addRegistration({
        eventId: event.id,
        ...formData,
      })

      router.push(`/events/register/${params.eventId}/success`)
    } catch (error) {
      console.error("Failed to register for event:", error)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  }

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading event information...</p>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Event not found</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Heart className="h-6 w-6 text-primary" />
            <span>Mission For Jesus</span>
          </Link>
          <Button variant="ghost" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 container py-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Register for Event</h1>
            <p className="text-muted-foreground">Complete the form below to register for this event</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{event.title}</CardTitle>
                <CardDescription>Event Details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Image
                  src={event.imageUrl || "/placeholder.svg?height=400&width=800"}
                  alt={event.title}
                  width={800}
                  height={400}
                  className="aspect-video w-full rounded-lg object-cover"
                />
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>
                      {formatTime(event.startTime)} - {formatTime(event.endTime)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{event.location}</span>
                  </div>
                </div>
                <p>{event.description}</p>
                {event.maxAttendees && (
                  <div className="mt-4 p-2 bg-muted rounded-md">
                    <p className="text-sm font-medium">
                      Availability: {registrationCount}/{event.maxAttendees} spots filled
                    </p>
                    <div className="w-full bg-secondary h-2 rounded-full mt-1">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{
                          width: `${Math.min(100, (registrationCount / event.maxAttendees) * 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Registration Form</CardTitle>
                <CardDescription>Please fill out all required fields</CardDescription>
              </CardHeader>
              <CardContent>
                {isEventClosed ? (
                  <div className="p-4 border border-destructive/50 bg-destructive/10 rounded-md text-center">
                    <h3 className="font-bold text-lg mb-2">Registration Closed</h3>
                    <p>
                      {event.maxAttendees
                        ? "This event has reached its maximum capacity."
                        : "Registration is no longer available for this event."}
                    </p>
                    <Button className="mt-4" asChild>
                      <Link href="/">Return to Homepage</Link>
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="numberOfAttendees">Number of Attendees</Label>
                      <Input
                        id="numberOfAttendees"
                        name="numberOfAttendees"
                        type="number"
                        min="1"
                        max={event.maxAttendees ? event.maxAttendees - registrationCount : undefined}
                        value={formData.numberOfAttendees}
                        onChange={handleNumberChange}
                        required
                      />
                      {event.maxAttendees && (
                        <p className="text-xs text-muted-foreground">
                          Maximum {event.maxAttendees - registrationCount} spots available
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                      <Textarea
                        id="specialRequests"
                        name="specialRequests"
                        value={formData.specialRequests}
                        onChange={handleChange}
                        placeholder="Any dietary restrictions, accessibility needs, or other requests"
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Register for Event
                    </Button>
                  </form>
                )}
              </CardContent>
              <CardFooter className="border-t pt-6">
                <p className="text-xs text-muted-foreground">
                  By registering for this event, you agree to provide accurate information and consent to being
                  contacted regarding this event.
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
