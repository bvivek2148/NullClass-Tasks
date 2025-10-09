import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

export function DemoCards() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Primary Actions Card */}
      <Card className="transition-smooth hover:shadow-soft">
        <CardHeader>
          <CardTitle>Primary Actions</CardTitle>
          <CardDescription>
            Beautiful buttons that adapt to your theme
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button className="w-full gradient-primary shadow-elegant">
            Primary Action
          </Button>
          <Button variant="outline" className="w-full">
            Secondary Action
          </Button>
          <Button variant="ghost" className="w-full">
            Ghost Action
          </Button>
        </CardContent>
      </Card>

      {/* Form Elements Card */}
      <Card className="transition-smooth hover:shadow-soft">
        <CardHeader>
          <CardTitle>Form Elements</CardTitle>
          <CardDescription>
            Input fields and controls that respect your theme
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="anjali.patel@example.com" />
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="notifications" />
            <Label htmlFor="notifications">Enable notifications</Label>
          </div>
          <div className="space-y-2">
            <Label>Progress</Label>
            <Progress value={65} className="w-full" />
          </div>
        </CardContent>
      </Card>

      {/* User Profile Card */}
      <Card className="transition-smooth hover:shadow-soft">
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
          <CardDescription>
            Avatar and badges showcase
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>AP</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">Anjali Patel</p>
              <p className="text-xs text-muted-foreground">anjali.patel@example.com</p>
            </div>
          </div>
          <Separator />
          <div className="flex flex-wrap gap-2">
            <Badge>Designer</Badge>
            <Badge variant="secondary">Developer</Badge>
            <Badge variant="outline">Creator</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}