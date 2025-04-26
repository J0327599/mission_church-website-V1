"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, ChevronRight, Heart, Users, BookOpen, Mail, Phone } from "lucide-react"
import { getUpcomingEvents } from "@/lib/data-utils"
import type { Event } from "@/lib/types"

export default function ChurchWebsite() {
  const [events, setEvents] = useState<Event[]>([])
  const [lastFetchTime, setLastFetchTime] = useState(Date.now())

  const loadEvents = async () => {
    try {
      // Add a timestamp parameter to avoid caching
      const eventData = await getUpcomingEvents()
      setEvents(eventData)
      setLastFetchTime(Date.now())
    } catch (error) {
      console.error("Failed to load events:", error)
    }
  }

  useEffect(() => {
    loadEvents()

    // This ensures events are reloaded when returning to this page
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Only reload if it's been more than 5 seconds since the last fetch
        if (Date.now() - lastFetchTime > 5000) {
          loadEvents()
        }
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [lastFetchTime])

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

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2 font-bold text-xl">
            <Heart className="h-6 w-6 text-primary" />
            <span>Mission For Jesus</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="#about" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </Link>
            <Link href="#services" className="text-sm font-medium hover:text-primary transition-colors">
              Services
            </Link>
            <Link href="#events" className="text-sm font-medium hover:text-primary transition-colors">
              Events
            </Link>
            <Link href="#ministries" className="text-sm font-medium hover:text-primary transition-colors">
              Ministries
            </Link>
            <Link href="#contact" className="text-sm font-medium hover:text-primary transition-colors">
              Contact
            </Link>
          </nav>
          <Button asChild className="hidden md:inline-flex">
            <Link href="#donate">Donate</Link>
          </Button>
          <Button variant="outline" size="icon" className="md:hidden">
            <span className="sr-only">Toggle menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </Button>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-muted relative">
          <div className="absolute inset-0 z-0">
            <Image
              src="/placeholder.svg?height=1080&width=1920"
              alt="Church building"
              fill
              className="object-cover opacity-20"
              priority
            />
          </div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Welcome to Mission For Jesus
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  A place of worship, community, and spiritual growth for all
                </p>
              </div>
              <div className="space-x-4">
                <Button asChild>
                  <Link href="#services">Join Us Sunday</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="#about">Learn More</Link>
                </Button>
                <Button variant="secondary" asChild>
                  <Link href="/membership">Become a Member</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
              <div>
                <Image
                  src="/placeholder.svg?height=720&width=1280"
                  alt="Church community"
                  width={640}
                  height={360}
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover"
                />
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">About Our Church</h2>
                <p className="text-muted-foreground md:text-lg">
                  Mission For Jesus has been serving our community for over 25 years. We are a welcoming congregation
                  dedicated to sharing God's love through worship, fellowship, and service.
                </p>
                <p className="text-muted-foreground md:text-lg">
                  Our mission is to create a place where people can encounter God, build meaningful relationships, and
                  grow in their faith journey. We believe in the power of community and the importance of supporting one
                  another through life's challenges and celebrations.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild>
                    <Link href="#contact">
                      Contact Us <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Worship Services</h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
                  Join us for worship and fellowship throughout the week
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
                <Clock className="h-10 w-10 text-primary" />
                <h3 className="text-xl font-bold">Sunday Morning</h3>
                <p className="text-center text-muted-foreground">
                  9:00 AM - Traditional Service
                  <br />
                  11:00 AM - Contemporary Service
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
                <Calendar className="h-10 w-10 text-primary" />
                <h3 className="text-xl font-bold">Wednesday Night</h3>
                <p className="text-center text-muted-foreground">
                  6:30 PM - Bible Study
                  <br />
                  7:00 PM - Youth Group
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
                <MapPin className="h-10 w-10 text-primary" />
                <h3 className="text-xl font-bold">Location</h3>
                <p className="text-center text-muted-foreground">
                  123 Faith Avenue
                  <br />
                  Hometown, ST 12345
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="events" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Upcoming Events</h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
                  Join us for these special events and activities
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-8 py-12 lg:grid-cols-2">
              {events.length > 0 ? (
                events.slice(0, 2).map((event) => (
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
                        <Button asChild>
                          <Link href="#contact">Learn More</Link>
                        </Button>
                        {event.registrationEnabled && (
                          <Button variant="outline" asChild>
                            <Link href={`/events/register/${event.id}`}>Register Now</Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-8">
                  <p className="text-muted-foreground">No upcoming events at this time. Check back soon!</p>
                </div>
              )}
            </div>
            {events.length > 2 && (
              <div className="text-center">
                <Button variant="outline" asChild>
                  <Link href="#events">View All Events</Link>
                </Button>
              </div>
            )}
          </div>
        </section>

        <section id="ministries" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Our Ministries</h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
                  Serving our congregation and community through various ministries
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-8 py-12 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 rounded-lg border bg-background p-6 shadow-sm">
                <Users className="h-10 w-10 text-primary" />
                <h3 className="text-xl font-bold">Family Ministry</h3>
                <p className="text-center text-muted-foreground">
                  Supporting families through all stages of life with resources, counseling, and community.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border bg-background p-6 shadow-sm">
                <BookOpen className="h-10 w-10 text-primary" />
                <h3 className="text-xl font-bold">Bible Study</h3>
                <p className="text-center text-muted-foreground">
                  Weekly studies for all ages to deepen understanding of scripture and faith.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border bg-background p-6 shadow-sm">
                <Heart className="h-10 w-10 text-primary" />
                <h3 className="text-xl font-bold">Outreach</h3>
                <p className="text-center text-muted-foreground">
                  Serving our local community through volunteer work and charitable initiatives.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border bg-background p-6 shadow-sm">
                <Users className="h-10 w-10 text-primary" />
                <h3 className="text-xl font-bold">Youth Group</h3>
                <p className="text-center text-muted-foreground">
                  Creating a safe and fun environment for teens to grow in faith and friendship.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border bg-background p-6 shadow-sm">
                <Users className="h-10 w-10 text-primary" />
                <h3 className="text-xl font-bold">Children's Ministry</h3>
                <p className="text-center text-muted-foreground">
                  Age-appropriate learning and activities for children to develop their faith.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border bg-background p-6 shadow-sm">
                <Heart className="h-10 w-10 text-primary" />
                <h3 className="text-xl font-bold">Prayer Team</h3>
                <p className="text-center text-muted-foreground">
                  Dedicated to praying for the needs of our church, community, and world.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Contact Us</h2>
                <p className="text-muted-foreground md:text-lg">
                  We'd love to hear from you. Reach out with any questions or prayer requests.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <p>123 Faith Avenue, Hometown, ST 12345</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <p>(555) 123-4567</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <p>info@missionforjesus.org</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Office Hours</h3>
                  <p className="text-muted-foreground">
                    Monday - Friday: 9:00 AM - 4:00 PM
                    <br />
                    Saturday: Closed
                    <br />
                    Sunday: 8:30 AM - 12:30 PM
                  </p>
                </div>
              </div>
              <div className="rounded-lg border p-6 shadow-sm">
                <h3 className="text-xl font-bold mb-4">Send Us a Message</h3>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="first-name"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        First name
                      </label>
                      <input
                        id="first-name"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="John"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="last-name"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Last name
                      </label>
                      <input
                        id="last-name"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="john.doe@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="message"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Type your message here."
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>

        <section id="donate" className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Support Our Ministry</h2>
                <p className="mx-auto max-w-[700px] md:text-lg">
                  Your generous donations help us continue our mission and serve our community.
                </p>
              </div>
              <div className="space-x-4">
                <Button variant="secondary" size="lg" asChild>
                  <Link href="#contact">Donate Now</Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
                  asChild
                >
                  <Link href="#contact">Learn About Planned Giving</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} Mission For Jesus. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
