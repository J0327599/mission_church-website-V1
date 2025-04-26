"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, ArrowLeft } from "lucide-react"
import { saveMemberData, getMemberData } from "@/lib/data-utils"
import type { Member } from "@/lib/types"

export default function MembershipForm() {
  const [membershipType, setMembershipType] = useState<"individual" | "family">("individual")
  const [formStep, setFormStep] = useState(1)
  const [formData, setFormData] = useState<Partial<Member>>({
    id: crypto.randomUUID(),
    membershipType: "individual",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    birthDate: "",
    password: "",
  })
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (name === "membershipType") {
      setMembershipType(value as "individual" | "family")
    }
  }

  const handleNextStep = () => {
    setFormStep((prev) => prev + 1)
  }

  const handlePrevStep = () => {
    setFormStep((prev) => prev - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Get existing members
      const existingMembers = await getMemberData()

      // Add new member
      const newMember = {
        ...formData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      } as Member

      const updatedMembers = [...existingMembers, newMember]

      // Save to database
      await saveMemberData(updatedMembers)

      // Redirect to success page
      router.push("/membership/success")
    } catch (error) {
      console.error("Failed to save member data:", error)
    }
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
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Become a Member</h1>
            <p className="text-muted-foreground">Join our church community by completing this membership form</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Membership Application</CardTitle>
              <CardDescription>
                Please fill out the form below. All information will be kept confidential.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                {formStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="membershipType">Membership Type</Label>
                      <Select
                        value={formData.membershipType}
                        onValueChange={(value) => handleSelectChange("membershipType", value)}
                      >
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue placeholder="Select membership type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="individual">Individual</SelectItem>
                          <SelectItem value="family">Family</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-4 grid-cols-2">
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
                      <Label htmlFor="email">Email Address</Label>
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
                      <Label htmlFor="birthDate">Birth Date</Label>
                      <Input
                        id="birthDate"
                        name="birthDate"
                        type="date"
                        value={formData.birthDate}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {membershipType === "family" && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="spouseName">Spouse Name</Label>
                          <Input
                            id="spouseName"
                            name="spouseName"
                            value={formData.spouseName || ""}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="anniversaryDate">Anniversary Date (if applicable)</Label>
                          <Input
                            id="anniversaryDate"
                            name="anniversaryDate"
                            type="date"
                            value={formData.anniversaryDate || ""}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="children">Children (names and ages, separated by commas)</Label>
                          <Input
                            id="children"
                            name="children"
                            value={formData.children || ""}
                            onChange={handleChange}
                            placeholder="e.g. John (12), Mary (8)"
                          />
                        </div>
                      </>
                    )}
                  </div>
                )}

                {formStep === 2 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="address">Street Address</Label>
                      <Input id="address" name="address" value={formData.address} onChange={handleChange} required />
                    </div>

                    <div className="grid gap-4 grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" name="city" value={formData.city} onChange={handleChange} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input id="state" name="state" value={formData.state} onChange={handleChange} required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="zipCode">Zip Code</Label>
                      <Input id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleChange} required />
                    </div>
                  </div>
                )}

                {formStep === 3 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Create Password</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength={8}
                      />
                      <p className="text-xs text-muted-foreground">Password must be at least 8 characters long</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input id="confirmPassword" name="confirmPassword" type="password" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ministryInterests">Ministry Interests (Optional)</Label>
                      <Input
                        id="ministryInterests"
                        name="ministryInterests"
                        value={formData.ministryInterests || ""}
                        onChange={handleChange}
                        placeholder="e.g. Worship, Youth, Outreach"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Additional Notes (Optional)</Label>
                      <Input
                        id="notes"
                        name="notes"
                        value={formData.notes || ""}
                        onChange={handleChange}
                        placeholder="Any additional information you'd like to share"
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-between mt-6">
                  {formStep > 1 && (
                    <Button type="button" variant="outline" onClick={handlePrevStep}>
                      Previous
                    </Button>
                  )}

                  {formStep < 3 ? (
                    <Button type="button" onClick={handleNextStep} className="ml-auto">
                      Next
                    </Button>
                  ) : (
                    <Button type="submit" className="ml-auto">
                      Submit Application
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <div className="text-sm text-muted-foreground">Step {formStep} of 3</div>
              <div className="text-sm">
                Already a member?{" "}
                <Link href="/member-login" className="text-primary hover:underline">
                  Login here
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}
