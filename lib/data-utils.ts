"use server"

import type { Member, Event, Registration } from "./types"

// In a real application, this would connect to a database
// For this example, we'll use a simple JSON file stored in memory

let memberDatabase: Member[] = [
  {
    id: "1",
    membershipType: "individual",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "(555) 123-4567",
    address: "123 Main St",
    city: "Anytown",
    state: "CA",
    zipCode: "12345",
    birthDate: "1980-05-15",
    password: "password123",
    ministryInterests: "Worship, Outreach",
    createdAt: "2023-01-15T12:00:00Z",
  },
  {
    id: "2",
    membershipType: "family",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    phone: "(555) 987-6543",
    address: "456 Oak Ave",
    city: "Somewhere",
    state: "NY",
    zipCode: "67890",
    birthDate: "1975-08-22",
    password: "password456",
    spouseName: "Michael Smith",
    anniversaryDate: "2005-06-12",
    children: "Emma (12), Jacob (8)",
    ministryInterests: "Children's Ministry, Bible Study",
    createdAt: "2023-02-20T14:30:00Z",
  },
]

// Initialize event database with sample events
let eventDatabase: Event[] = [
  {
    id: "1",
    title: "Annual Community Picnic",
    description:
      "Join us for food, games, and fellowship at our annual community picnic. Everyone is welcome to attend this family-friendly event.",
    date: "2025-07-15",
    startTime: "11:00",
    endTime: "15:00",
    location: "Community Park",
    imageUrl: "/placeholder.svg?height=400&width=800",
    registrationEnabled: true,
    maxAttendees: 100,
    createdAt: "2023-01-15T12:00:00Z",
  },
  {
    id: "2",
    title: "Vacation Bible School",
    description:
      "A week of fun, learning, and spiritual growth for children ages 5-12. Registration is required and space is limited.",
    date: "2025-08-07",
    startTime: "09:00",
    endTime: "12:00",
    location: "Church Education Building",
    imageUrl: "/placeholder.svg?height=400&width=800",
    registrationEnabled: true,
    maxAttendees: 50,
    createdAt: "2023-02-20T14:30:00Z",
  },
]

// Initialize registration database
let registrationDatabase: Registration[] = [
  {
    id: "1",
    eventId: "1",
    firstName: "Michael",
    lastName: "Johnson",
    email: "michael.johnson@example.com",
    phone: "(555) 234-5678",
    numberOfAttendees: 3,
    specialRequests: "Vegetarian meal options, please.",
    createdAt: "2023-03-10T09:15:00Z",
  },
  {
    id: "2",
    eventId: "2",
    firstName: "Sarah",
    lastName: "Williams",
    email: "sarah.williams@example.com",
    phone: "(555) 876-5432",
    numberOfAttendees: 2,
    specialRequests: "Children ages 6 and 8.",
    createdAt: "2023-03-15T14:30:00Z",
  },
]

// Member functions
export async function getMemberData(): Promise<Member[]> {
  // In a real app, this would fetch from a database
  return memberDatabase
}

export async function saveMemberData(data: Member[]): Promise<void> {
  // In a real app, this would save to a database
  memberDatabase = data
}

export async function getMemberById(id: string): Promise<Member | undefined> {
  return memberDatabase.find((member) => member.id === id)
}

export async function authenticateMember(email: string, password: string): Promise<Member | null> {
  const member = memberDatabase.find((m) => m.email.toLowerCase() === email.toLowerCase() && m.password === password)

  return member || null
}

// Event functions
export async function getEventData(): Promise<Event[]> {
  return eventDatabase
}

export async function getUpcomingEvents(): Promise<Event[]> {
  const today = new Date()
  return eventDatabase
    .filter((event) => new Date(event.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

export async function getEventById(id: string): Promise<Event | undefined> {
  return eventDatabase.find((event) => event.id === id)
}

export async function saveEventData(data: Event[]): Promise<void> {
  eventDatabase = data
}

export async function addEvent(event: Omit<Event, "id" | "createdAt">): Promise<Event> {
  const newEvent: Event = {
    ...event,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }

  eventDatabase.push(newEvent)

  // Sort events by date to ensure proper order
  eventDatabase.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return newEvent
}

export async function updateEvent(id: string, eventData: Partial<Event>): Promise<Event | null> {
  const index = eventDatabase.findIndex((event) => event.id === id)

  if (index === -1) return null

  eventDatabase[index] = {
    ...eventDatabase[index],
    ...eventData,
  }

  // Sort events by date to ensure proper order
  eventDatabase.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return eventDatabase[index]
}

export async function deleteEvent(id: string): Promise<boolean> {
  const initialLength = eventDatabase.length
  eventDatabase = eventDatabase.filter((event) => event.id !== id)
  return eventDatabase.length < initialLength
}

// Registration functions
export async function getRegistrations(): Promise<Registration[]> {
  return registrationDatabase
}

export async function getRegistrationsByEventId(eventId: string): Promise<Registration[]> {
  return registrationDatabase.filter((registration) => registration.eventId === eventId)
}

export async function getRegistrationById(id: string): Promise<Registration | undefined> {
  return registrationDatabase.find((registration) => registration.id === id)
}

export async function addRegistration(registration: Omit<Registration, "id" | "createdAt">): Promise<Registration> {
  const newRegistration: Registration = {
    ...registration,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }

  registrationDatabase.push(newRegistration)
  return newRegistration
}

export async function updateRegistration(
  id: string,
  registrationData: Partial<Registration>,
): Promise<Registration | null> {
  const index = registrationDatabase.findIndex((registration) => registration.id === id)

  if (index === -1) return null

  registrationDatabase[index] = {
    ...registrationDatabase[index],
    ...registrationData,
  }

  return registrationDatabase[index]
}

export async function deleteRegistration(id: string): Promise<boolean> {
  const initialLength = registrationDatabase.length
  registrationDatabase = registrationDatabase.filter((registration) => registration.id !== id)
  return registrationDatabase.length < initialLength
}

export async function getRegistrationCountByEventId(eventId: string): Promise<number> {
  const registrations = registrationDatabase.filter((registration) => registration.eventId === eventId)
  return registrations.reduce((total, registration) => total + registration.numberOfAttendees, 0)
}

export async function isEventFull(eventId: string): Promise<boolean> {
  const event = await getEventById(eventId)
  if (!event || !event.maxAttendees) return false

  const registrationCount = await getRegistrationCountByEventId(eventId)
  return registrationCount >= event.maxAttendees
}
