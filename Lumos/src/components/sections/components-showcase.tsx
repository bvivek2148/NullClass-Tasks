import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Download, 
  Mail, 
  Plus, 
  Search, 
  Trash2, 
  Upload,
  CheckCircle2,
  AlertCircle,
  Info,
  XCircle,
  Loader2,
  Star,
  Heart,
  Share2,
  Settings,
  User,
  Calendar
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function ComponentsShowcase() {
  const [progressValue, setProgressValue] = useState(65);
  const [isEnabled, setIsEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState("option1");
  const { toast } = useToast();

  return (
    <section id="components" className="py-24 sm:py-32 bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Components
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Theme-Aware Components
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Every component automatically adapts to your theme with smooth transitions and beautiful styling.
          </p>
        </div>

        {/* Components Demo */}
        <div className="mx-auto max-w-5xl">
          <Tabs defaultValue="buttons" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="buttons">Buttons</TabsTrigger>
              <TabsTrigger value="forms">Forms</TabsTrigger>
              <TabsTrigger value="data">Data Display</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
            </TabsList>

            {/* Buttons Tab */}
            <TabsContent value="buttons" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="transition-all duration-300 hover:shadow-elegant">
                  <CardHeader>
                    <CardTitle>Button Variants</CardTitle>
                    <CardDescription>
                      Different styles for various use cases
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full gradient-primary text-white shadow-elegant">
                      Primary
                    </Button>
                    <Button variant="secondary" className="w-full">
                      Secondary
                    </Button>
                    <Button variant="outline" className="w-full">
                      Outline
                    </Button>
                    <Button variant="ghost" className="w-full">
                      Ghost
                    </Button>
                    <Button variant="destructive" className="w-full">
                      Destructive
                    </Button>
                    <Button variant="link" className="w-full">
                      Link
                    </Button>
                  </CardContent>
                </Card>

                <Card className="transition-all duration-300 hover:shadow-elegant">
                  <CardHeader>
                    <CardTitle>Buttons with Icons</CardTitle>
                    <CardDescription>
                      Enhanced with lucide-react icons
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full">
                      <Mail className="mr-2 h-4 w-4" />
                      Send Email
                    </Button>
                    <Button variant="secondary" className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload File
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Search className="mr-2 h-4 w-4" />
                      Search
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Button>
                    <Button variant="destructive" className="w-full">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </CardContent>
                </Card>

                <Card className="transition-all duration-300 hover:shadow-elegant">
                  <CardHeader>
                    <CardTitle>Button Sizes & States</CardTitle>
                    <CardDescription>
                      Different sizes and loading states
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Sizes</p>
                      <div className="flex items-center gap-2">
                        <Button size="sm">Small</Button>
                        <Button size="default">Default</Button>
                        <Button size="lg">Large</Button>
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <p className="text-sm font-medium">States</p>
                      <Button 
                        className="w-full" 
                        disabled={isLoading}
                        onClick={() => {
                          setIsLoading(true);
                          setTimeout(() => setIsLoading(false), 2000);
                        }}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          "Click Me"
                        )}
                      </Button>
                      <Button className="w-full" disabled>
                        Disabled
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="transition-all duration-300 hover:shadow-elegant">
                  <CardHeader>
                    <CardTitle>Icon-Only Buttons</CardTitle>
                    <CardDescription>
                      Compact buttons for actions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      <Button size="icon" variant="outline">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="outline">
                        <Star className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="outline">
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button size="icon">
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="secondary">
                        <Search className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="transition-all duration-300 hover:shadow-elegant">
                  <CardHeader>
                    <CardTitle>Button Groups</CardTitle>
                    <CardDescription>
                      Connected button combinations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex">
                      <Button className="rounded-r-none">
                        Previous
                      </Button>
                      <Button className="rounded-l-none border-l-0">
                        Next
                      </Button>
                    </div>
                    <div className="inline-flex rounded-lg border border-border">
                      <Button variant="ghost" className="rounded-r-none border-r">
                        Day
                      </Button>
                      <Button variant="ghost" className="rounded-none border-r">
                        Week
                      </Button>
                      <Button variant="ghost" className="rounded-l-none">
                        Month
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Forms Tab */}
            <TabsContent value="forms" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="transition-all duration-300 hover:shadow-elegant">
                  <CardHeader>
                    <CardTitle>Text Inputs</CardTitle>
                    <CardDescription>
                      Various input field styles
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="Vivek Kumar" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="vivek@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" placeholder="••••••••" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="search">Search</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="search" placeholder="Search..." className="pl-9" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="transition-all duration-300 hover:shadow-elegant">
                  <CardHeader>
                    <CardTitle>Select & Textarea</CardTitle>
                    <CardDescription>
                      Dropdown selections and text areas
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Select>
                        <SelectTrigger id="country">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="india">India</SelectItem>
                          <SelectItem value="usa">United States</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                          <SelectItem value="canada">Canada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea 
                        id="message" 
                        placeholder="Type your message here..." 
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="transition-all duration-300 hover:shadow-elegant">
                  <CardHeader>
                    <CardTitle>Checkboxes & Switches</CardTitle>
                    <CardDescription>
                      Toggle options and selections
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="terms" />
                        <Label htmlFor="terms" className="text-sm font-normal">
                          Accept terms and conditions
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="marketing" />
                        <Label htmlFor="marketing" className="text-sm font-normal">
                          Subscribe to marketing emails
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="newsletter" defaultChecked />
                        <Label htmlFor="newsletter" className="text-sm font-normal">
                          Receive newsletter updates
                        </Label>
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="notifications">Notifications</Label>
                        <Switch 
                          id="notifications" 
                          checked={isEnabled}
                          onCheckedChange={setIsEnabled}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="dark-mode">Dark Mode</Label>
                        <Switch id="dark-mode" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="transition-all duration-300 hover:shadow-elegant">
                  <CardHeader>
                    <CardTitle>Radio Groups</CardTitle>
                    <CardDescription>
                      Single selection options
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={selectedValue} onValueChange={setSelectedValue}>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="option1" id="option1" />
                          <Label htmlFor="option1" className="font-normal">
                            Option 1 - Default selection
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="option2" id="option2" />
                          <Label htmlFor="option2" className="font-normal">
                            Option 2 - Alternative choice
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="option3" id="option3" />
                          <Label htmlFor="option3" className="font-normal">
                            Option 3 - Another option
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="option4" id="option4" disabled />
                          <Label htmlFor="option4" className="font-normal opacity-50">
                            Option 4 - Disabled
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                <Card className="transition-all duration-300 hover:shadow-elegant col-span-full">
                  <CardHeader>
                    <CardTitle>Complete Form Example</CardTitle>
                    <CardDescription>
                      A fully styled contact form
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input id="firstName" placeholder="Vivek" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input id="lastName" placeholder="Kumar" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="emailFull">Email</Label>
                        <Input id="emailFull" type="email" placeholder="vivek.kumar@example.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Select>
                          <SelectTrigger id="subject">
                            <SelectValue placeholder="Select a subject" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General Inquiry</SelectItem>
                            <SelectItem value="support">Technical Support</SelectItem>
                            <SelectItem value="feedback">Feedback</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="messageFull">Your Message</Label>
                        <Textarea id="messageFull" placeholder="Tell us what's on your mind..." rows={5} />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="agreeFull" />
                        <Label htmlFor="agreeFull" className="text-sm font-normal">
                          I agree to the privacy policy
                        </Label>
                      </div>
                      <Button type="submit" className="w-full gradient-primary text-white">
                        <Mail className="mr-2 h-4 w-4" />
                        Send Message
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Data Display Tab */}
            <TabsContent value="data" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="transition-all duration-300 hover:shadow-elegant">
                  <CardHeader>
                    <CardTitle>User Profiles</CardTitle>
                    <CardDescription>
                      Avatar and user information display
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>VK</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Vivek Kumar</p>
                        <p className="text-sm text-muted-foreground">Product Designer</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>AK</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Amit Kumar</p>
                        <p className="text-sm text-muted-foreground">Software Engineer</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>PS</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Priya Sharma</p>
                        <p className="text-sm text-muted-foreground">UX Researcher</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="transition-all duration-300 hover:shadow-elegant">
                  <CardHeader>
                    <CardTitle>Badges & Status</CardTitle>
                    <CardDescription>
                      Status indicators and labels
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium mb-2">Status Badges</p>
                        <div className="flex flex-wrap gap-2">
                          <Badge>Active</Badge>
                          <Badge variant="secondary">Pending</Badge>
                          <Badge variant="outline">Inactive</Badge>
                          <Badge variant="destructive">Error</Badge>
                        </div>
                      </div>
                      <Separator />
                      <div>
                        <p className="text-sm font-medium mb-2">Skills & Tags</p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary">React</Badge>
                          <Badge variant="secondary">TypeScript</Badge>
                          <Badge variant="secondary">Tailwind</Badge>
                          <Badge variant="secondary">Node.js</Badge>
                        </div>
                      </div>
                      <Separator />
                      <div>
                        <p className="text-sm font-medium mb-2">With Icons</p>
                        <div className="flex flex-wrap gap-2">
                          <Badge className="gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Verified
                          </Badge>
                          <Badge variant="secondary" className="gap-1">
                            <Star className="h-3 w-3" />
                            Premium
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="transition-all duration-300 hover:shadow-elegant col-span-full">
                  <CardHeader>
                    <CardTitle>Data Table</CardTitle>
                    <CardDescription>
                      Structured data display with styled table
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Vivek Kumar</TableCell>
                          <TableCell>Product Designer</TableCell>
                          <TableCell>
                            <Badge>Active</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Amit Kumar</TableCell>
                          <TableCell>Software Engineer</TableCell>
                          <TableCell>
                            <Badge>Active</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Priya Sharma</TableCell>
                          <TableCell>UX Researcher</TableCell>
                          <TableCell>
                            <Badge variant="secondary">Away</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card className="transition-all duration-300 hover:shadow-elegant">
                  <CardHeader>
                    <CardTitle>Stats Cards</CardTitle>
                    <CardDescription>
                      Showcase key metrics and statistics
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">Total Users</p>
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <p className="text-2xl font-bold">2,543</p>
                      <div className="flex items-center text-sm">
                        <span className="text-green-600">+12.5%</span>
                        <span className="text-muted-foreground ml-2">from last month</span>
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">Revenue</p>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <p className="text-2xl font-bold">$45,231</p>
                      <div className="flex items-center text-sm">
                        <span className="text-green-600">+8.2%</span>
                        <span className="text-muted-foreground ml-2">from last month</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="transition-all duration-300 hover:shadow-elegant">
                  <CardHeader>
                    <CardTitle>Progress Indicators</CardTitle>
                    <CardDescription>
                      Visual progress and completion tracking
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <Label>Project Completion</Label>
                        <span>{progressValue}%</span>
                      </div>
                      <Progress value={progressValue} className="w-full" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <Label>Storage Used</Label>
                        <span>75%</span>
                      </div>
                      <Progress value={75} className="w-full" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <Label>Team Activity</Label>
                        <span>90%</span>
                      </div>
                      <Progress value={90} className="w-full" />
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setProgressValue(Math.max(0, progressValue - 10))}
                      >
                        -10%
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setProgressValue(Math.min(100, progressValue + 10))}
                      >
                        +10%
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Feedback Tab */}
            <TabsContent value="feedback" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="transition-all duration-300 hover:shadow-elegant">
                  <CardHeader>
                    <CardTitle>Alert Messages</CardTitle>
                    <CardDescription>
                      Different alert styles for various scenarios
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertTitle>Information</AlertTitle>
                      <AlertDescription>
                        This is an informational message for your reference.
                      </AlertDescription>
                    </Alert>
                    <Alert variant="default" className="border-green-500/50 text-green-600 dark:text-green-400">
                      <CheckCircle2 className="h-4 w-4" />
                      <AlertTitle>Success</AlertTitle>
                      <AlertDescription>
                        Your changes have been saved successfully.
                      </AlertDescription>
                    </Alert>
                    <Alert variant="default" className="border-yellow-500/50 text-yellow-600 dark:text-yellow-400">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Warning</AlertTitle>
                      <AlertDescription>
                        Please review your information before proceeding.
                      </AlertDescription>
                    </Alert>
                    <Alert variant="destructive">
                      <XCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>
                        Something went wrong. Please try again.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>

                <Card className="transition-all duration-300 hover:shadow-elegant">
                  <CardHeader>
                    <CardTitle>Toast Notifications</CardTitle>
                    <CardDescription>
                      Temporary feedback messages
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => {
                        toast({
                          title: "Success!",
                          description: "Your action was completed successfully.",
                        });
                      }}
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Show Success Toast
                    </Button>
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => {
                        toast({
                          title: "Information",
                          description: "Here's some useful information for you.",
                        });
                      }}
                    >
                      <Info className="mr-2 h-4 w-4" />
                      Show Info Toast
                    </Button>
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => {
                        toast({
                          variant: "destructive",
                          title: "Error",
                          description: "Something went wrong. Please try again.",
                        });
                      }}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Show Error Toast
                    </Button>
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => {
                        toast({
                          title: "Scheduled: Catch up",
                          description: "Friday, February 10, 2023 at 5:57 PM",
                        });
                      }}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      Show Custom Toast
                    </Button>
                  </CardContent>
                </Card>

                <Card className="transition-all duration-300 hover:shadow-elegant">
                  <CardHeader>
                    <CardTitle>Loading States</CardTitle>
                    <CardDescription>
                      Skeleton loaders and spinners
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Skeleton Loader</p>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-4/5" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Profile Card Loading</p>
                      <div className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Spinner</p>
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <span className="text-sm text-muted-foreground">Loading...</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="transition-all duration-300 hover:shadow-elegant">
                  <CardHeader>
                    <CardTitle>Empty States</CardTitle>
                    <CardDescription>
                      Messages when no data is available
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 space-y-3">
                      <div className="flex justify-center">
                        <div className="rounded-full bg-muted p-3">
                          <Search className="h-6 w-6 text-muted-foreground" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">No results found</h3>
                        <p className="text-sm text-muted-foreground">
                          Try adjusting your search or filter to find what you're looking for.
                        </p>
                      </div>
                      <Button variant="outline" className="mt-4">
                        <Plus className="mr-2 h-4 w-4" />
                        Create New
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}