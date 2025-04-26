export interface Member {
  id: string
  membershipType: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  birthDate: string
  password: string
  spouseName?: string
  anniversaryDate?: string
  children?: string
  ministryInterests?: string
  notes?: string
  createdAt: string
}

export interface Event {
  id: string
  title: string
  description: string
  date: string
  startTime: string
  endTime: string
  location: string
  imageUrl?: string
  registrationEnabled: boolean
  maxAttendees?: number
  createdAt: string
}

export interface Registration {
  id: string
  eventId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  numberOfAttendees: number
  specialRequests?: string
  createdAt: string
}
