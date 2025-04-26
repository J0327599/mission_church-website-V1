"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Heart, ArrowLeft, Plus, Edit, Trash2, Calendar, Clock, MapPin, Users } from "lucide-react"
import { getEventData, addEvent, updateEvent, deleteEvent, getRegistrationCountByEventId } from "@/lib/data-utils"
import type { Event } from "@/lib/types"

export default function EventsManagement() {
  const [events, setEvents] = useState<Event[]>([])
  const [eventRegistrations, setEventRegistrations] = useState<Record<string, number>>({})
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [formData, setFormData] = useState<Partial<Event>>({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    imageUrl: "/placeholder.svg?height=400&width=800",
    registrationEnabled: false,
    maxAttendees: 0,
  })
  const router = useRouter()

  const loadEvents = async () => {
    try {
      const data = await getEventData()
      setEvents(data)

      // Load registration counts for each event
      const registrationCounts: Record<string, number> = {}
      for (const event of data) {
        const count = await getRegistrationCountByEventId(event.id)
        registrationCounts[event.id] = count
      }
      setEventRegistrations(registrationCounts)
    } catch (error) {
      console.error("Failed to load events:", error)
    }
  }

  useEffect(() => {
    loadEvents()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, registrationEnabled: checked }))
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value === "" ? undefined : Number(value) }))
  }

  const handleAddEvent = () => {
    setFormData({
      title: "",
      description: "",
      date: "",
      startTime: "",
      endTime: "",
      location: "",
      imageUrl: "/placeholder.svg?height=400&width=800",
      registrationEnabled: false,
      maxAttendees: 0,
    })
    setIsAddDialogOpen(true)
  }

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event)
    setFormData(event)
    setIsEditDialogOpen(true)
  }

  const handleDeleteEvent = (event: Event) => {
    setSelectedEvent(event)
    setIsDeleteDialogOpen(true)
  }

  const handleSubmitAdd = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const newEvent = await addEvent(formData as Omit<Event, "id" | "createdAt">)

      // Reload events to get the updated list
      await loadEvents()

      setIsAddDialogOpen(false)
    } catch (error) {
      console.error("Failed to add event:", error)
    }
  }

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedEvent) return

    try {
      const updatedEvent = await updateEvent(selectedEvent.id, formData)

      // Reload events to get the updated list
      await loadEvents()

      setIsEditDialogOpen(false)
    } catch (error) {
      console.error("Failed to update event:", error)
    }
  }

  const confirmDelete = async () => {
    if (!selectedEvent) return

    try {
      const success = await deleteEvent(selectedEvent.id)

      if (success) {
        // Reload events to get the updated list
        await loadEvents()
      }

      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error("Failed to delete event:", error)
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

  const viewRegistrations = (eventId: string) => {
    router.push(`/admin/dashboard/events/registrations/${eventId}`)
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
          <h1 className="text-3xl font-bold">Event Management</h1>
          <Button onClick={handleAddEvent}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Event
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Manage church events that will appear on the website</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>A list of all church events</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Registration</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.length > 0 ? (
                  events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">{event.title}</TableCell>
                      <TableCell>{formatDate(event.date)}</TableCell>
                      <TableCell>
                        {formatTime(event.startTime)} - {formatTime(event.endTime)}
                      </TableCell>
                      <TableCell>{event.location}</TableCell>
                      <TableCell>
                        {event.registrationEnabled ? (
                          <div className="flex items-center">
                            <span className="text-green-600 font-medium mr-2">Enabled</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => viewRegistrations(event.id)}
                              className="ml-2"
                            >
                              <Users className="h-4 w-4 mr-1" />
                              {eventRegistrations[event.id] || 0}/{event.maxAttendees || "∞"}
                            </Button>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Disabled</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditEvent(event)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteEvent(event)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No events found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Event Preview</h2>
          <p className="text-muted-foreground mb-6">This is how events will appear on the website</p>

          <div className="grid gap-8 md:grid-cols-2">
            {events.slice(0, 2).map((event) => (
              <div key={event.id} className="rounded-lg border shadow-sm">
                <Image
                  src={event.imageUrl || "/placeholder.svg?height=400&width=800"}
                  alt={event.title}
                  width={800}
                  height={400}
                  className="aspect-video w-full rounded-t-lg object-cover"
                />
                <div className="p-6">
                  <h3 className="text-2xl font-bold">{event.title}</h3>
                  <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>
                      {formatTime(event.startTime)} - {formatTime(event.endTime)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                  <p className="mt-4">{event.description}</p>
                  <div className="mt-4 flex gap-2">
                    <Button>Learn More</Button>
                    {event.registrationEnabled && (
                      <Button variant="outline">
                        Register Now
                        {event.maxAttendees && (
                          <span className="ml-2 text-xs">
                            ({eventRegistrations[event.id] || 0}/{event.maxAttendees})
                          </span>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Add Event Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
            <DialogDescription>Create a new event that will appear on the website</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitAdd}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" name="location" value={formData.location} onChange={handleChange} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    name="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    name="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL (Optional)</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="/placeholder.svg?height=400&width=800"
                />
                <p className="text-xs text-muted-foreground">Leave blank to use default image</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="registrationEnabled">Enable Registration</Label>
                  <Switch
                    id="registrationEnabled"
                    checked={formData.registrationEnabled}
                    onCheckedChange={handleSwitchChange}
                  />
                </div>
                <p className="text-xs text-muted-foreground">Allow visitors to register for this event</p>
              </div>
              {formData.registrationEnabled && (
                <div className="space-y-2">
                  <Label htmlFor="maxAttendees">Maximum Attendees (Optional)</Label>
                  <Input
                    id="maxAttendees"
                    name="maxAttendees"
                    type="number"
                    min="0"
                    value={formData.maxAttendees === 0 ? "" : formData.maxAttendees}
                    onChange={handleNumberChange}
                    placeholder="Leave blank for unlimited"
                  />
                  <p className="text-xs text-muted-foreground">Set a limit for the number of attendees</p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Event</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Event Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>Update event details</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitEdit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Event Title</Label>
                <Input id="edit-title" name="title" value={formData.title} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-date">Date</Label>
                  <Input
                    id="edit-date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-location">Location</Label>
                  <Input
                    id="edit-location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-startTime">Start Time</Label>
                  <Input
                    id="edit-startTime"
                    name="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-endTime">End Time</Label>
                  <Input
                    id="edit-endTime"
                    name="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-imageUrl">Image URL (Optional)</Label>
                <Input
                  id="edit-imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="/placeholder.svg?height=400&width=800"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="edit-registrationEnabled">Enable Registration</Label>
                  <Switch
                    id="edit-registrationEnabled"
                    checked={formData.registrationEnabled}
                    onCheckedChange={handleSwitchChange}
                  />
                </div>
                <p className="text-xs text-muted-foreground">Allow visitors to register for this event</p>
              </div>
              {formData.registrationEnabled && (
                <div className="space-y-2">
                  <Label htmlFor="edit-maxAttendees">Maximum Attendees (Optional)</Label>
                  <Input
                    id="edit-maxAttendees"
                    name="maxAttendees"
                    type="number"
                    min="0"
                    value={formData.maxAttendees === 0 ? "" : formData.maxAttendees}
                    onChange={handleNumberChange}
                    placeholder="Leave blank for unlimited"
                  />
                  <p className="text-xs text-muted-foreground">Set a limit for the number of attendees</p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this event? This action cannot be undone.
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
