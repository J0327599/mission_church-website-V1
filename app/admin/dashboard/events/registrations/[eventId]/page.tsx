"use client"

export async function generateStaticParams() {
  // TODO: Replace with your actual event IDs for production
  return [
    { eventId: 'demo-event-1' },
    { eventId: 'demo-event-2' }
  ];
}

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Heart, ArrowLeft, Trash2, Mail, Phone } from "lucide-react"
import {
  getEventById,
  getRegistrationsByEventId,
  deleteRegistration,
  getRegistrationCountByEventId,
} from "@/lib/data-utils"
import type { Event, Registration } from "@/lib/types"

export default function EventRegistrations({ params }: { params: { eventId: string } }) {
  const [event, setEvent] = useState<Event | null>(null)
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [totalAttendees, setTotalAttendees] = useState(0)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null)
  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
      try {
        const eventData = await getEventById(params.eventId)
        if (!eventData) {
          router.push("/admin/dashboard/events")
          return
        }
        setEvent(eventData)

        const registrationData = await getRegistrationsByEventId(params.eventId)
        setRegistrations(registrationData)

        const count = await getRegistrationCountByEventId(params.eventId)
        setTotalAttendees(count)
      } catch (error) {
        console.error("Failed to load data:", error)
      }
    }

    loadData()
  }, [params.eventId, router])

  const handleDeleteRegistration = (registration: Registration) => {
    setSelectedRegistration(registration)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedRegistration) return

    try {
      const success = await deleteRegistration(selectedRegistration.id)

      if (success) {
        setRegistrations(registrations.filter((reg) => reg.id !== selectedRegistration.id))
        setTotalAttendees(totalAttendees - selectedRegistration.numberOfAttendees)
      }

      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error("Failed to delete registration:", error)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
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
            <Link href="/admin/dashboard/events">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Events
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 container py-6">
        {event ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold">{event.title} - Registrations</h1>
                <p className="text-muted-foreground">
                  {formatDate(event.date)} | {event.location}
                </p>
              </div>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Registration Summary</CardTitle>
                <CardDescription>Overview of registrations for this event</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg border p-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Registrations</h3>
                    <p className="text-2xl font-bold">{registrations.length}</p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Attendees</h3>
                    <p className="text-2xl font-bold">{totalAttendees}</p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Capacity</h3>
                    <p className="text-2xl font-bold">
                      {event.maxAttendees ? `${totalAttendees}/${event.maxAttendees}` : "Unlimited"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Registration List</CardTitle>
                <CardDescription>People who have registered for this event</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableCaption>A list of all registrations for this event</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Attendees</TableHead>
                      <TableHead>Registration Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {registrations.length > 0 ? (
                      registrations.map((registration) => (
                        <TableRow key={registration.id}>
                          <TableCell className="font-medium">
                            {registration.firstName} {registration.lastName}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span>{registration.email}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span>{registration.phone}</span>
                            </div>
                          </TableCell>
                          <TableCell>{registration.numberOfAttendees}</TableCell>
                          <TableCell>{new Date(registration.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteRegistration(registration)}>
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center">
                          No registrations found for this event
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="flex items-center justify-center h-[50vh]">
            <p>Loading event information...</p>
          </div>
        )}
      </main>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this registration? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
