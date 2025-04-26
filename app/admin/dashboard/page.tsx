"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Users, CalendarIcon, Database, LogOut, User, Home, PlusCircle } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { getMemberData, getEventData } from "@/lib/data-utils"
import type { Member, Event } from "@/lib/types"

export default function AdminDashboard() {
  const [members, setMembers] = useState<Member[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([])
  const [date, setDate] = useState<Date | undefined>(new Date())
  const router = useRouter()

  useEffect(() => {
    // In a real app, we would check for authentication here
    // and redirect if not authenticated

    // Load data
    const loadData = async () => {
      try {
        const memberData = await getMemberData()
        setMembers(memberData)

        const eventData = await getEventData()
        setEvents(eventData)

        // Generate upcoming events (birthdays, anniversaries)
        const memberEvents = generateUpcomingEvents(memberData)

        // Combine with church events
        const churchEvents = eventData.map((event) => ({
          type: "event",
          date: new Date(event.date),
          description: event.title,
          details: `${formatTime(event.startTime)} - ${formatTime(event.endTime)}, ${event.location}`,
          event: event,
        }))

        setUpcomingEvents([...memberEvents, ...churchEvents].sort((a, b) => a.date.getTime() - b.date.getTime()))
      } catch (error) {
        console.error("Failed to load data:", error)
      }
    }

    loadData()
  }, [])

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }

  const generateUpcomingEvents = (members: Member[]) => {
    const events: any[] = []
    const today = new Date()

    // Add birthdays
    members.forEach((member) => {
      if (member.birthDate) {
        const birthDate = new Date(member.birthDate)
        const thisYearBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate())

        // If birthday already passed this year, use next year
        if (thisYearBirthday < today) {
          thisYearBirthday.setFullYear(today.getFullYear() + 1)
        }

        events.push({
          type: "birthday",
          date: thisYearBirthday,
          member: member,
          description: `${member.firstName} ${member.lastName}'s Birthday`,
        })
      }

      // Add anniversaries for family members
      if (member.anniversaryDate) {
        const anniversaryDate = new Date(member.anniversaryDate)
        const thisYearAnniversary = new Date(today.getFullYear(), anniversaryDate.getMonth(), anniversaryDate.getDate())

        // If anniversary already passed this year, use next year
        if (thisYearAnniversary < today) {
          thisYearAnniversary.setFullYear(today.getFullYear() + 1)
        }

        events.push({
          type: "anniversary",
          date: thisYearAnniversary,
          member: member,
          description: `${member.firstName} & ${member.spouseName} Anniversary`,
        })
      }
    })

    // Sort events by date
    events.sort((a, b) => a.date.getTime() - b.date.getTime())

    // Return only upcoming events (next 30 days)
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(today.getDate() + 30)

    return events.filter((event) => event.date <= thirtyDaysFromNow)
  }

  const handleLogout = () => {
    router.push("/")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Heart className="h-6 w-6 text-primary" />
            <span>Mission For Jesus</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/admin/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
              Dashboard
            </Link>
            <Link href="/admin/dashboard/database" className="text-sm font-medium hover:text-primary transition-colors">
              Church Database
            </Link>
            <Link href="/admin/dashboard/events" className="text-sm font-medium hover:text-primary transition-colors">
              Events
            </Link>
            <Link href="/admin/dashboard/calendar" className="text-sm font-medium hover:text-primary transition-colors">
              Calendar
            </Link>
          </nav>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Logout</span>
          </Button>
        </div>
      </header>

      <main className="flex-1 container py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                View Website
              </Link>
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Total Members</CardTitle>
                  <CardDescription>Active church members</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">{members.length}</div>
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Upcoming Birthdays</CardTitle>
                  <CardDescription>Next 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">
                      {upcomingEvents.filter((e) => e.type === "birthday").length}
                    </div>
                    <User className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Upcoming Anniversaries</CardTitle>
                  <CardDescription>Next 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">
                      {upcomingEvents.filter((e) => e.type === "anniversary").length}
                    </div>
                    <Heart className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Church Events</CardTitle>
                  <CardDescription>Next 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">{upcomingEvents.filter((e) => e.type === "event").length}</div>
                    <CalendarIcon className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                  <CardDescription>Birthdays, anniversaries, and church events in the next 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  {upcomingEvents.length > 0 ? (
                    <ul className="space-y-2">
                      {upcomingEvents.slice(0, 5).map((event, index) => (
                        <li key={index} className="flex justify-between items-center border-b pb-2">
                          <div>
                            <p className="font-medium">{event.description}</p>
                            <p className="text-sm text-muted-foreground">{event.date.toLocaleDateString()}</p>
                            {event.details && <p className="text-sm text-muted-foreground">{event.details}</p>}
                          </div>
                          {event.type === "birthday" ? (
                            <User className="h-4 w-4 text-primary" />
                          ) : event.type === "anniversary" ? (
                            <Heart className="h-4 w-4 text-primary" />
                          ) : (
                            <CalendarIcon className="h-4 w-4 text-primary" />
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">No upcoming events in the next 30 days</p>
                  )}
                </CardContent>
              </Card>

              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full justify-start" asChild>
                    <Link href="/admin/dashboard/database">
                      <Database className="mr-2 h-4 w-4" />
                      Manage Church Database
                    </Link>
                  </Button>
                  <Button className="w-full justify-start" asChild>
                    <Link href="/admin/dashboard/events">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Manage Events
                    </Link>
                  </Button>
                  <Button className="w-full justify-start" asChild>
                    <Link href="/admin/dashboard/calendar">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      View Calendar
                    </Link>
                  </Button>
                  <Button className="w-full justify-start" variant="outline" asChild>
                    <Link href="/membership">
                      <User className="mr-2 h-4 w-4" />
                      Add New Member
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="members" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Church Members</CardTitle>
                  <CardDescription>Manage your church membership database</CardDescription>
                </div>
                <Button asChild>
                  <Link href="/admin/dashboard/database">
                    <Database className="mr-2 h-4 w-4" />
                    Open Database
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {members.length > 0 ? (
                  <div className="border rounded-md">
                    <div className="grid grid-cols-4 gap-4 p-4 font-medium border-b">
                      <div>Name</div>
                      <div>Email</div>
                      <div>Phone</div>
                      <div>Membership Type</div>
                    </div>
                    <div className="divide-y">
                      {members.slice(0, 5).map((member, index) => (
                        <div key={index} className="grid grid-cols-4 gap-4 p-4">
                          <div>
                            {member.firstName} {member.lastName}
                          </div>
                          <div>{member.email}</div>
                          <div>{member.phone}</div>
                          <div>{member.membershipType}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No members found in the database</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Church Events</CardTitle>
                  <CardDescription>Manage your church events</CardDescription>
                </div>
                <Button asChild>
                  <Link href="/admin/dashboard/events">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Manage Events
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {events.length > 0 ? (
                  <div className="border rounded-md">
                    <div className="grid grid-cols-4 gap-4 p-4 font-medium border-b">
                      <div>Event</div>
                      <div>Date</div>
                      <div>Time</div>
                      <div>Location</div>
                    </div>
                    <div className="divide-y">
                      {events.slice(0, 5).map((event, index) => (
                        <div key={index} className="grid grid-cols-4 gap-4 p-4">
                          <div>{event.title}</div>
                          <div>{new Date(event.date).toLocaleDateString()}</div>
                          <div>
                            {formatTime(event.startTime)} - {formatTime(event.endTime)}
                          </div>
                          <div>{event.location}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No events found in the database</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Church Calendar</CardTitle>
                <CardDescription>View upcoming birthdays, anniversaries, and events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/2">
                    <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
                  </div>
                  <div className="md:w-1/2">
                    <h3 className="font-medium mb-2">Events on {date?.toLocaleDateString()}</h3>
                    {upcomingEvents.filter((event) => event.date.toDateString() === date?.toDateString()).length > 0 ? (
                      <ul className="space-y-2">
                        {upcomingEvents
                          .filter((event) => event.date.toDateString() === date?.toDateString())
                          .map((event, index) => (
                            <li key={index} className="flex items-center gap-2 p-2 border rounded-md">
                              {event.type === "birthday" ? (
                                <User className="h-4 w-4 text-primary" />
                              ) : event.type === "anniversary" ? (
                                <Heart className="h-4 w-4 text-primary" />
                              ) : (
                                <CalendarIcon className="h-4 w-4 text-primary" />
                              )}
                              <div>
                                <span>{event.description}</span>
                                {event.details && <p className="text-xs text-muted-foreground">{event.details}</p>}
                              </div>
                            </li>
                          ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground">No events on this date</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
