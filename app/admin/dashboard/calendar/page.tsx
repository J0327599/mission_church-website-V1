"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Heart, ArrowLeft, User, CalendarIcon } from "lucide-react"
import { getMemberData } from "@/lib/data-utils"
import type { Member } from "@/lib/types"

export default function CalendarView() {
  const [members, setMembers] = useState<Member[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedDateEvents, setSelectedDateEvents] = useState<any[]>([])

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getMemberData()
        setMembers(data)

        // Generate events from member data
        const generatedEvents = generateEvents(data)
        setEvents(generatedEvents)
      } catch (error) {
        console.error("Failed to load data:", error)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    if (date) {
      const eventsOnSelectedDate = events.filter((event) => event.date.toDateString() === date.toDateString())
      setSelectedDateEvents(eventsOnSelectedDate)
    }
  }, [date, events])

  const generateEvents = (members: Member[]) => {
    const events: any[] = []
    const currentYear = new Date().getFullYear()

    // Add birthdays
    members.forEach((member) => {
      if (member.birthDate) {
        const birthDate = new Date(member.birthDate)
        const thisYearBirthday = new Date(currentYear, birthDate.getMonth(), birthDate.getDate())

        events.push({
          type: "birthday",
          date: thisYearBirthday,
          member: member,
          description: `${member.firstName} ${member.lastName}'s Birthday`,
        })

        // Also add next year's birthday
        const nextYearBirthday = new Date(currentYear + 1, birthDate.getMonth(), birthDate.getDate())
        events.push({
          type: "birthday",
          date: nextYearBirthday,
          member: member,
          description: `${member.firstName} ${member.lastName}'s Birthday`,
        })
      }

      // Add anniversaries
      if (member.anniversaryDate) {
        const anniversaryDate = new Date(member.anniversaryDate)
        const thisYearAnniversary = new Date(currentYear, anniversaryDate.getMonth(), anniversaryDate.getDate())

        events.push({
          type: "anniversary",
          date: thisYearAnniversary,
          member: member,
          description: `${member.firstName} & ${member.spouseName} Anniversary`,
        })

        // Also add next year's anniversary
        const nextYearAnniversary = new Date(currentYear + 1, anniversaryDate.getMonth(), anniversaryDate.getDate())
        events.push({
          type: "anniversary",
          date: nextYearAnniversary,
          member: member,
          description: `${member.firstName} & ${member.spouseName} Anniversary`,
        })
      }
    })

    // Add church events (these would typically come from a separate events database)
    const churchEvents = [
      {
        type: "event",
        date: new Date(currentYear, 6, 15), // July 15
        description: "Annual Community Picnic",
        details: "11:00 AM - 3:00 PM at Community Park",
      },
      {
        type: "event",
        date: new Date(currentYear, 7, 7), // August 7
        description: "Vacation Bible School Begins",
        details: "9:00 AM - 12:00 PM, August 7-11",
      },
      {
        type: "event",
        date: new Date(currentYear, 11, 24), // December 24
        description: "Christmas Eve Service",
        details: "7:00 PM in the Main Sanctuary",
      },
    ]

    return [...events, ...churchEvents].sort((a, b) => a.date.getTime() - b.date.getTime())
  }

  // Function to highlight dates with events on the calendar
  const isDayWithEvent = (day: Date) => {
    return events.some((event) => event.date.toDateString() === day.toDateString())
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
            <Link href="/admin/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 container py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Church Calendar</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Calendar View</CardTitle>
              <CardDescription>View birthdays, anniversaries, and church events</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
                modifiers={{
                  hasEvent: (date) => isDayWithEvent(date),
                }}
                modifiersClassNames={{
                  hasEvent: "bg-primary/10 font-bold text-primary",
                }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Events on {date?.toLocaleDateString()}</CardTitle>
              <CardDescription>
                {selectedDateEvents.length} {selectedDateEvents.length === 1 ? "event" : "events"} on this date
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedDateEvents.length > 0 ? (
                <ul className="space-y-4">
                  {selectedDateEvents.map((event, index) => (
                    <li key={index} className="p-4 border rounded-md">
                      <div className="flex items-center gap-2 mb-2">
                        {event.type === "birthday" && <User className="h-5 w-5 text-primary" />}
                        {event.type === "anniversary" && <Heart className="h-5 w-5 text-primary" />}
                        {event.type === "event" && <CalendarIcon className="h-5 w-5 text-primary" />}
                        <h3 className="font-medium">{event.description}</h3>
                      </div>
                      {event.details && <p className="text-sm text-muted-foreground ml-7">{event.details}</p>}
                      {event.member && (
                        <div className="text-sm text-muted-foreground ml-7 mt-1">
                          <p>Email: {event.member.email}</p>
                          <p>Phone: {event.member.phone}</p>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No events scheduled for this date</p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Next 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            {events.length > 0 ? (
              <ul className="space-y-2 divide-y">
                {events
                  .filter((event) => {
                    const today = new Date()
                    const thirtyDaysFromNow = new Date()
                    thirtyDaysFromNow.setDate(today.getDate() + 30)
                    return event.date >= today && event.date <= thirtyDaysFromNow
                  })
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .map((event, index) => (
                    <li key={index} className="pt-2 first:pt-0 pb-2 last:pb-0">
                      <div className="flex items-center gap-2">
                        {event.type === "birthday" && <User className="h-4 w-4 text-primary" />}
                        {event.type === "anniversary" && <Heart className="h-4 w-4 text-primary" />}
                        {event.type === "event" && <CalendarIcon className="h-4 w-4 text-primary" />}
                        <div>
                          <p className="font-medium">{event.description}</p>
                          <p className="text-sm text-muted-foreground">{event.date.toLocaleDateString()}</p>
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No upcoming events in the next 30 days</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
