import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export default function MembershipSuccess() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="text-2xl">Membership Application Submitted!</CardTitle>
          <CardDescription>Thank you for becoming a member of Mission For Jesus</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">
            Your application has been received and is being processed. You can now use your email and password to access
            your member account.
          </p>
          <p className="text-sm text-muted-foreground">
            A confirmation email has been sent to your email address with further instructions.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button asChild className="w-full">
            <Link href="/member-login">Login to Your Account</Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/">Return to Homepage</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
