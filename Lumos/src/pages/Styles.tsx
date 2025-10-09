import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  Palette, 
  HelpCircle, 
  Settings, 
  User, 
  Mail, 
  Phone,
  MapPin,
  Calendar,
  Star,
  Heart,
  Share2,
  Download,
  Upload,
  Trash2,
  Edit,
  Eye,
  Lock,
  Unlock,
  Plus,
  Search,
  Menu,
  X,
  ChevronDown,
  Home,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  Bell,
  ShoppingCart,
  CreditCard,
  TrendingUp
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Toggle } from "@/components/ui/toggle";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

export default function Styles() {
  return (
    <TooltipProvider>
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto max-w-7xl px-4 py-12">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-purple-600">
            <Palette className="h-8 w-8 text-white" />
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            Theme Showcase
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Explore all component styles in both light and dark modes. Toggle the theme to see how each element adapts.
          </p>
        </div>

        <div className="space-y-12">
          {/* Button Variants */}
          <section>
            <h2 className="mb-6 text-3xl font-bold tracking-tight">Buttons</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="transition-smooth hover:shadow-soft">
                <CardHeader>
                  <CardTitle>Button Variants</CardTitle>
                  <CardDescription>Different button styles and states</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Default</Label>
                    <Button className="w-full">Primary Button</Button>
                  </div>
                  <div className="space-y-2">
                    <Label>Secondary</Label>
                    <Button variant="secondary" className="w-full">Secondary Button</Button>
                  </div>
                  <div className="space-y-2">
                    <Label>Outline</Label>
                    <Button variant="outline" className="w-full">Outline Button</Button>
                  </div>
                  <div className="space-y-2">
                    <Label>Ghost</Label>
                    <Button variant="ghost" className="w-full">Ghost Button</Button>
                  </div>
                  <div className="space-y-2">
                    <Label>Destructive</Label>
                    <Button variant="destructive" className="w-full">Destructive Button</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="transition-smooth hover:shadow-soft">
                <CardHeader>
                  <CardTitle>Button Sizes</CardTitle>
                  <CardDescription>Different button sizes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Large</Label>
                    <Button size="lg" className="w-full">Large Button</Button>
                  </div>
                  <div className="space-y-2">
                    <Label>Default</Label>
                    <Button className="w-full">Default Button</Button>
                  </div>
                  <div className="space-y-2">
                    <Label>Small</Label>
                    <Button size="sm" className="w-full">Small Button</Button>
                  </div>
                  <div className="space-y-2">
                    <Label>Icon</Label>
                    <Button size="icon">
                      <Palette className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Form Elements */}
          <section>
            <h2 className="mb-6 text-3xl font-bold tracking-tight">Form Elements</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="transition-smooth hover:shadow-soft">
                <CardHeader>
                  <CardTitle>Input Fields</CardTitle>
                  <CardDescription>Text inputs and labels</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="priya.sharma@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" placeholder="••••••••" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="disabled">Disabled Input</Label>
                    <Input id="disabled" disabled placeholder="Disabled input" />
                  </div>
                </CardContent>
              </Card>

              <Card className="transition-smooth hover:shadow-soft">
                <CardHeader>
                  <CardTitle>Controls</CardTitle>
                  <CardDescription>Switches and progress bars</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="switch1">Enable notifications</Label>
                    <Switch id="switch1" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="switch2">Marketing emails</Label>
                    <Switch id="switch2" defaultChecked />
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label>Progress - 33%</Label>
                    <Progress value={33} />
                  </div>
                  <div className="space-y-2">
                    <Label>Progress - 66%</Label>
                    <Progress value={66} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Badges */}
          <section>
            <h2 className="mb-6 text-3xl font-bold tracking-tight">Badges</h2>
            <Card className="transition-smooth hover:shadow-soft">
              <CardHeader>
                <CardTitle>Badge Variants</CardTitle>
                <CardDescription>Different badge styles for labels and status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                  <Badge className="bg-green-500 hover:bg-green-600">Success</Badge>
                  <Badge className="bg-yellow-500 hover:bg-yellow-600">Warning</Badge>
                  <Badge className="bg-blue-500 hover:bg-blue-600">Info</Badge>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Alerts */}
          <section>
            <h2 className="mb-6 text-3xl font-bold tracking-tight">Alerts</h2>
            <div className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Default Alert</AlertTitle>
                <AlertDescription>
                  This is a default alert with an informational message.
                </AlertDescription>
              </Alert>

              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error Alert</AlertTitle>
                <AlertDescription>
                  This is a destructive alert indicating an error or warning.
                </AlertDescription>
              </Alert>

              <Alert className="border-green-500 dark:border-green-700">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
                <AlertTitle>Success Alert</AlertTitle>
                <AlertDescription>
                  This is a success alert confirming a completed action.
                </AlertDescription>
              </Alert>
            </div>
          </section>

          {/* Cards & Avatars */}
          <section>
            <h2 className="mb-6 text-3xl font-bold tracking-tight">Cards & Avatars</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="transition-smooth hover:shadow-soft">
                <CardHeader>
                  <CardTitle>User Profile</CardTitle>
                  <CardDescription>Profile information card</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>VK</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">Vivek Kumar</p>
                      <p className="text-xs text-muted-foreground">vivek.kumar@example.com</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex flex-wrap gap-2">
                    <Badge>Designer</Badge>
                    <Badge variant="secondary">Developer</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="transition-smooth hover:shadow-soft">
                <CardHeader>
                  <CardTitle>Statistics</CardTitle>
                  <CardDescription>Key metrics overview</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Completion</span>
                      <span className="text-sm text-muted-foreground">85%</span>
                    </div>
                    <Progress value={85} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Performance</span>
                      <span className="text-sm text-muted-foreground">92%</span>
                    </div>
                    <Progress value={92} />
                  </div>
                </CardContent>
              </Card>

              <Card className="transition-smooth hover:shadow-soft">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common operations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Palette className="mr-2 h-4 w-4" />
                    Change Theme
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Info className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Mark Complete
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Tabs */}
          <section>
            <h2 className="mb-6 text-3xl font-bold tracking-tight">Tabs</h2>
            <Card className="transition-smooth hover:shadow-soft">
              <CardContent className="pt-6">
                <Tabs defaultValue="account" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                  </TabsList>
                  <TabsContent value="account" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" placeholder="amit_verma" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Input id="bio" placeholder="Software developer from Mumbai" />
                    </div>
                  </TabsContent>
                  <TabsContent value="settings" className="space-y-4 pt-4">
                    <div className="flex items-center justify-between">
                      <Label>Two-factor authentication</Label>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Auto-save</Label>
                      <Switch defaultChecked />
                    </div>
                  </TabsContent>
                  <TabsContent value="notifications" className="space-y-4 pt-4">
                    <div className="flex items-center justify-between">
                      <Label>Email notifications</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Push notifications</Label>
                      <Switch />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </section>

          {/* Tooltips & Popovers */}
          <section>
            <h2 className="mb-6 text-3xl font-bold tracking-tight">Tooltips & Popovers</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="transition-smooth hover:shadow-soft">
                <CardHeader>
                  <CardTitle>Tooltips</CardTitle>
                  <CardDescription>Hover over buttons to see tooltips</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-3">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon">
                          <HelpCircle className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Need help? Contact support</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Settings</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon">
                          <User className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View Profile</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Heart className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Add to Favorites</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button className="w-full">Hover for Info</Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>This button performs the main action</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </CardContent>
              </Card>

              <Card className="transition-smooth hover:shadow-soft">
                <CardHeader>
                  <CardTitle>Popovers</CardTitle>
                  <CardDescription>Click to open interactive content</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <User className="mr-2 h-4 w-4" />
                        View User Details
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-3">
                        <h4 className="font-semibold">Vivek Kumar</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center">
                            <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>vivek.kumar@example.com</span>
                          </div>
                          <div className="flex items-center">
                            <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>+91 98765 43210</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>Mumbai, Maharashtra</span>
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <Settings className="mr-2 h-4 w-4" />
                        Quick Settings
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-4">
                        <h4 className="font-semibold">Preferences</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label>Notifications</Label>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>Auto-save</Label>
                            <Switch />
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Hover Cards */}
          <section>
            <h2 className="mb-6 text-3xl font-bold tracking-tight">Hover Cards</h2>
            <Card className="transition-smooth hover:shadow-soft">
              <CardHeader>
                <CardTitle>Interactive Hover Cards</CardTitle>
                <CardDescription>Hover over usernames to see detailed information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button variant="link" className="text-primary">@vivek_kumar</Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="flex space-x-4">
                        <Avatar>
                          <AvatarImage src="https://github.com/shadcn.png" />
                          <AvatarFallback>VK</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <h4 className="text-sm font-semibold">Vivek Kumar</h4>
                          <p className="text-sm text-muted-foreground">
                            Full-stack developer passionate about creating beautiful user experiences.
                          </p>
                          <div className="flex items-center pt-2">
                            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              Joined December 2023
                            </span>
                          </div>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>

                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button variant="link" className="text-primary">@priya_sharma</Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="flex space-x-4">
                        <Avatar>
                          <AvatarImage src="https://github.com/shadcn.png" />
                          <AvatarFallback>PS</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <h4 className="text-sm font-semibold">Priya Sharma</h4>
                          <p className="text-sm text-muted-foreground">
                            UI/UX designer focused on accessibility and modern design systems.
                          </p>
                          <div className="flex items-center pt-2">
                            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              Joined January 2024
                            </span>
                          </div>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Accordions */}
          <section>
            <h2 className="mb-6 text-3xl font-bold tracking-tight">Accordions</h2>
            <Card className="transition-smooth hover:shadow-soft">
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>Click to expand and view answers</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>What is a dark mode theme?</AccordionTrigger>
                    <AccordionContent>
                      A dark mode theme is a color scheme that uses light-colored text and UI elements on dark backgrounds. 
                      It's designed to reduce eye strain in low-light conditions and save battery life on OLED screens.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>How do I switch between themes?</AccordionTrigger>
                    <AccordionContent>
                      You can switch themes using the theme toggle button in the header. Your preference is automatically 
                      saved in your browser's local storage, so it persists across sessions.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Are themes customizable?</AccordionTrigger>
                    <AccordionContent>
                      Yes! The theme system is built with CSS variables, making it easy to customize colors, spacing, 
                      and other design tokens. You can modify the design system in the index.css file.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger>Does it work on mobile devices?</AccordionTrigger>
                    <AccordionContent>
                      Absolutely! The theme system is fully responsive and works seamlessly across all devices, 
                      including smartphones, tablets, and desktop computers.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </section>

          {/* Form Controls Extended */}
          <section>
            <h2 className="mb-6 text-3xl font-bold tracking-tight">Advanced Form Controls</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="transition-smooth hover:shadow-soft">
                <CardHeader>
                  <CardTitle>Checkboxes & Radio Buttons</CardTitle>
                  <CardDescription>Selection controls</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Select Features</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="feature1" defaultChecked />
                        <label htmlFor="feature1" className="text-sm font-medium">
                          Dark Mode Support
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="feature2" defaultChecked />
                        <label htmlFor="feature2" className="text-sm font-medium">
                          Theme Persistence
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="feature3" />
                        <label htmlFor="feature3" className="text-sm font-medium">
                          Custom Colors
                        </label>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Choose Plan</Label>
                    <RadioGroup defaultValue="pro">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="free" id="free" />
                        <Label htmlFor="free">Free - ₹0/month</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="pro" id="pro" />
                        <Label htmlFor="pro">Pro - ₹499/month</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="enterprise" id="enterprise" />
                        <Label htmlFor="enterprise">Enterprise - ₹2999/month</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>

              <Card className="transition-smooth hover:shadow-soft">
                <CardHeader>
                  <CardTitle>Select & Textarea</CardTitle>
                  <CardDescription>Dropdown and text area inputs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Select defaultValue="mumbai">
                      <SelectTrigger id="city">
                        <SelectValue placeholder="Select a city" />
                      </SelectTrigger>
                      <SelectContent className="bg-background">
                        <SelectItem value="mumbai">Mumbai</SelectItem>
                        <SelectItem value="delhi">Delhi</SelectItem>
                        <SelectItem value="bangalore">Bangalore</SelectItem>
                        <SelectItem value="hyderabad">Hyderabad</SelectItem>
                        <SelectItem value="chennai">Chennai</SelectItem>
                        <SelectItem value="kolkata">Kolkata</SelectItem>
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

                  <div className="space-y-2">
                    <Label htmlFor="volume">Volume</Label>
                    <Slider id="volume" defaultValue={[50]} max={100} step={1} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Loading States */}
          <section>
            <h2 className="mb-6 text-3xl font-bold tracking-tight">Loading States</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="transition-smooth hover:shadow-soft">
                <CardHeader>
                  <CardTitle>Skeleton Loaders</CardTitle>
                  <CardDescription>Placeholder components while loading</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </CardContent>
              </Card>

              <Card className="transition-smooth hover:shadow-soft">
                <CardHeader>
                  <CardTitle>Progress Indicators</CardTitle>
                  <CardDescription>Various loading states</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Uploading files...</Label>
                      <span className="text-sm text-muted-foreground">45%</span>
                    </div>
                    <Progress value={45} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Processing data...</Label>
                      <span className="text-sm text-muted-foreground">78%</span>
                    </div>
                    <Progress value={78} className="[&>div]:bg-green-500" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Syncing...</Label>
                      <span className="text-sm text-muted-foreground">100%</span>
                    </div>
                    <Progress value={100} className="[&>div]:bg-blue-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Icon Buttons Grid */}
          <section>
            <h2 className="mb-6 text-3xl font-bold tracking-tight">Icon Buttons</h2>
            <Card className="transition-smooth hover:shadow-soft">
              <CardHeader>
                <CardTitle>Action Buttons</CardTitle>
                <CardDescription>Common action buttons with icons</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-3 md:grid-cols-8">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Star className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Favorite</p></TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Like</p></TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Share</p></TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Download</p></TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Upload</p></TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Edit</p></TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>View</p></TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Delete</p></TooltipContent>
                  </Tooltip>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Gradient Cards */}
          <section>
            <h2 className="mb-6 text-3xl font-bold tracking-tight">Gradient Cards</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-500 to-cyan-500 text-white transition-all duration-300 hover:shadow-2xl hover:scale-105">
                <CardHeader>
                  <Lock className="h-8 w-8 mb-2" />
                  <CardTitle>Secure</CardTitle>
                  <CardDescription className="text-blue-100">
                    End-to-end encryption
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-blue-50">
                    Your data is protected with industry-standard security measures.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="secondary" className="w-full">
                    Learn More
                  </Button>
                </CardFooter>
              </Card>

              <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-purple-500 to-pink-500 text-white transition-all duration-300 hover:shadow-2xl hover:scale-105">
                <CardHeader>
                  <Star className="h-8 w-8 mb-2" />
                  <CardTitle>Premium</CardTitle>
                  <CardDescription className="text-purple-100">
                    Exclusive features
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-purple-50">
                    Access advanced tools and priority support.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="secondary" className="w-full">
                    Upgrade Now
                  </Button>
                </CardFooter>
              </Card>

              <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-green-500 to-emerald-500 text-white transition-all duration-300 hover:shadow-2xl hover:scale-105">
                <CardHeader>
                  <CheckCircle2 className="h-8 w-8 mb-2" />
                  <CardTitle>Verified</CardTitle>
                  <CardDescription className="text-green-100">
                    Trusted by thousands
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-green-50">
                    Join our community of verified users worldwide.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="secondary" className="w-full">
                    Get Verified
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </section>

          {/* Avatar Groups */}
          <section>
            <h2 className="mb-6 text-3xl font-bold tracking-tight">Avatar Groups</h2>
            <Card className="transition-smooth hover:shadow-soft">
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>User avatars in different arrangements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="mb-3 block">Stacked Avatars</Label>
                  <div className="flex -space-x-4">
                    <Avatar className="border-2 border-background">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>VK</AvatarFallback>
                    </Avatar>
                    <Avatar className="border-2 border-background">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>PS</AvatarFallback>
                    </Avatar>
                    <Avatar className="border-2 border-background">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>RK</AvatarFallback>
                    </Avatar>
                    <Avatar className="border-2 border-background">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>AP</AvatarFallback>
                    </Avatar>
                    <Avatar className="border-2 border-background bg-muted">
                      <AvatarFallback>+5</AvatarFallback>
                    </Avatar>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="mb-3 block">Grid Layout</Label>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center space-y-2">
                      <Avatar className="mx-auto">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>VK</AvatarFallback>
                      </Avatar>
                      <p className="text-xs">Vivek</p>
                    </div>
                    <div className="text-center space-y-2">
                      <Avatar className="mx-auto">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>PS</AvatarFallback>
                      </Avatar>
                      <p className="text-xs">Priya</p>
                    </div>
                    <div className="text-center space-y-2">
                      <Avatar className="mx-auto">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>RK</AvatarFallback>
                      </Avatar>
                      <p className="text-xs">Rajesh</p>
                    </div>
                    <div className="text-center space-y-2">
                      <Avatar className="mx-auto">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>AP</AvatarFallback>
                      </Avatar>
                      <p className="text-xs">Anjali</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Dialogs & Modals */}
          <section>
            <h2 className="mb-6 text-3xl font-bold tracking-tight">Dialogs & Modals</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="transition-smooth hover:shadow-soft">
                <CardHeader>
                  <CardTitle>Dialog Examples</CardTitle>
                  <CardDescription>Click buttons to open dialogs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <Plus className="mr-2 h-4 w-4" />
                        Create New Project
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Project</DialogTitle>
                        <DialogDescription>
                          Enter the details for your new project. Click save when you're done.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="project-name">Project Name</Label>
                          <Input id="project-name" placeholder="My Awesome Project" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="project-desc">Description</Label>
                          <Textarea id="project-desc" placeholder="Brief description..." rows={3} />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline">Cancel</Button>
                        <Button>Save Project</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Confirmation
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. This will permanently delete your account
                          and remove your data from our servers.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline">Cancel</Button>
                        <Button variant="destructive">Delete</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>

              <Card className="transition-smooth hover:shadow-soft">
                <CardHeader>
                  <CardTitle>Sheet/Drawer Examples</CardTitle>
                  <CardDescription>Side panels and drawers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <Menu className="mr-2 h-4 w-4" />
                        Open Menu
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Navigation Menu</SheetTitle>
                        <SheetDescription>
                          Access all sections from here
                        </SheetDescription>
                      </SheetHeader>
                      <div className="space-y-4 py-6">
                        <Button variant="ghost" className="w-full justify-start">
                          <Home className="mr-2 h-4 w-4" />
                          Home
                        </Button>
                        <Button variant="ghost" className="w-full justify-start">
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Button>
                        <Button variant="ghost" className="w-full justify-start">
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </Button>
                        <Separator />
                        <Button variant="ghost" className="w-full justify-start text-destructive">
                          <X className="mr-2 h-4 w-4" />
                          Logout
                        </Button>
                      </div>
                    </SheetContent>
                  </Sheet>

                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Shopping Cart
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Shopping Cart</SheetTitle>
                        <SheetDescription>3 items in your cart</SheetDescription>
                      </SheetHeader>
                      <div className="space-y-4 py-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="h-12 w-12 rounded bg-muted flex items-center justify-center">
                              <ImageIcon className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Product 1</p>
                              <p className="text-xs text-muted-foreground">₹999</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between font-semibold">
                          <span>Total</span>
                          <span>₹2,997</span>
                        </div>
                        <Button className="w-full">
                          <CreditCard className="mr-2 h-4 w-4" />
                          Checkout
                        </Button>
                      </div>
                    </SheetContent>
                  </Sheet>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Dropdown Menus */}
          <section>
            <h2 className="mb-6 text-3xl font-bold tracking-tight">Dropdown Menus</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="transition-smooth hover:shadow-soft">
                <CardHeader>
                  <CardTitle>Simple Dropdown</CardTitle>
                  <CardDescription>Basic menu items</CardDescription>
                </CardHeader>
                <CardContent>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full">
                        Actions <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Bell className="mr-2 h-4 w-4" />
                        Notifications
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <X className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardContent>
              </Card>

              <Card className="transition-smooth hover:shadow-soft">
                <CardHeader>
                  <CardTitle>With Checkboxes</CardTitle>
                  <CardDescription>Multi-select options</CardDescription>
                </CardHeader>
                <CardContent>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full">
                        View Options <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>Display Settings</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuCheckboxItem checked>
                        Show Sidebar
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem checked>
                        Show Toolbar
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem>
                        Show Footer
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem>
                        Compact Mode
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardContent>
              </Card>

              <Card className="transition-smooth hover:shadow-soft">
                <CardHeader>
                  <CardTitle>Radio Group</CardTitle>
                  <CardDescription>Single selection</CardDescription>
                </CardHeader>
                <CardContent>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full">
                        Sort By <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>Sort Order</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuRadioGroup value="date">
                        <DropdownMenuRadioItem value="date">
                          Date Created
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="name">
                          Name
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="size">
                          File Size
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="type">
                          File Type
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Data Tables */}
          <section>
            <h2 className="mb-6 text-3xl font-bold tracking-tight">Data Tables</h2>
            <Card className="transition-smooth hover:shadow-soft">
              <CardHeader>
                <CardTitle>User List</CardTitle>
                <CardDescription>Tabular data display</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Vivek Kumar</TableCell>
                        <TableCell>vivek.kumar@example.com</TableCell>
                        <TableCell>
                          <Badge>Admin</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
                            Active
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Priya Sharma</TableCell>
                        <TableCell>priya.sharma@example.com</TableCell>
                        <TableCell>
                          <Badge variant="secondary">Editor</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
                            Active
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Rajesh Kumar</TableCell>
                        <TableCell>rajesh.kumar@example.com</TableCell>
                        <TableCell>
                          <Badge variant="outline">Viewer</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
                            Pending
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Anjali Patel</TableCell>
                        <TableCell>anjali.patel@example.com</TableCell>
                        <TableCell>
                          <Badge variant="secondary">Editor</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">
                            Inactive
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Toggle & Toggle Groups */}
          <section>
            <h2 className="mb-6 text-3xl font-bold tracking-tight">Toggle Controls</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="transition-smooth hover:shadow-soft">
                <CardHeader>
                  <CardTitle>Single Toggles</CardTitle>
                  <CardDescription>Individual toggle buttons</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Bold Text</Label>
                    <Toggle aria-label="Toggle bold">
                      <strong>B</strong>
                    </Toggle>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Italic Text</Label>
                    <Toggle aria-label="Toggle italic">
                      <em>I</em>
                    </Toggle>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Favorite</Label>
                    <Toggle aria-label="Toggle favorite">
                      <Star className="h-4 w-4" />
                    </Toggle>
                  </div>
                </CardContent>
              </Card>

              <Card className="transition-smooth hover:shadow-soft">
                <CardHeader>
                  <CardTitle>Toggle Groups</CardTitle>
                  <CardDescription>Multiple selection toggles</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Text Alignment</Label>
                    <ToggleGroup type="single" defaultValue="center">
                      <ToggleGroupItem value="left" aria-label="Align left">
                        Left
                      </ToggleGroupItem>
                      <ToggleGroupItem value="center" aria-label="Align center">
                        Center
                      </ToggleGroupItem>
                      <ToggleGroupItem value="right" aria-label="Align right">
                        Right
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>

                  <div className="space-y-2">
                    <Label>File Types</Label>
                    <ToggleGroup type="multiple">
                      <ToggleGroupItem value="images" aria-label="Images">
                        <ImageIcon className="h-4 w-4" />
                      </ToggleGroupItem>
                      <ToggleGroupItem value="videos" aria-label="Videos">
                        <Video className="h-4 w-4" />
                      </ToggleGroupItem>
                      <ToggleGroupItem value="documents" aria-label="Documents">
                        <FileText className="h-4 w-4" />
                      </ToggleGroupItem>
                      <ToggleGroupItem value="audio" aria-label="Audio">
                        <Music className="h-4 w-4" />
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Breadcrumbs & Navigation */}
          <section>
            <h2 className="mb-6 text-3xl font-bold tracking-tight">Breadcrumbs & Navigation</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="transition-smooth hover:shadow-soft">
                <CardHeader>
                  <CardTitle>Breadcrumb Navigation</CardTitle>
                  <CardDescription>Page location hierarchy</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem>
                        <BreadcrumbLink href="/">
                          <Home className="h-4 w-4" />
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbLink href="/styles">Styles</BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbPage>Components</BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>

                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem>
                        <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbLink href="/projects/123">Vivek's Project</BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbPage>Settings</BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                </CardContent>
              </Card>

              <Card className="transition-smooth hover:shadow-soft">
                <CardHeader>
                  <CardTitle>Stats Cards</CardTitle>
                  <CardDescription>Dashboard metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                          <p className="text-2xl font-bold">12,543</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <div className="mt-2 flex items-center text-sm">
                        <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                        <span className="text-green-500">+12.5%</span>
                        <span className="ml-1 text-muted-foreground">from last month</span>
                      </div>
                    </div>

                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                          <p className="text-2xl font-bold">₹4,52,890</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                          <CreditCard className="h-6 w-6 text-green-500" />
                        </div>
                      </div>
                      <div className="mt-2 flex items-center text-sm">
                        <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                        <span className="text-green-500">+8.2%</span>
                        <span className="ml-1 text-muted-foreground">from last month</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Advanced Card Layouts */}
          <section>
            <h2 className="mb-6 text-3xl font-bold tracking-tight">Advanced Card Layouts</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="transition-smooth hover:shadow-soft overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                <CardHeader className="-mt-8">
                  <Avatar className="h-16 w-16 border-4 border-background">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>VK</AvatarFallback>
                  </Avatar>
                  <CardTitle className="mt-2">Vivek Kumar</CardTitle>
                  <CardDescription>Senior Developer</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Badge>React</Badge>
                    <Badge>TypeScript</Badge>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">View Profile</Button>
                </CardFooter>
              </Card>

              <Card className="transition-smooth hover:shadow-soft">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Notifications</CardTitle>
                    <Badge variant="destructive">3 New</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Bell className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">New message received</p>
                      <p className="text-xs text-muted-foreground">2 minutes ago</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Project deployed successfully</p>
                      <p className="text-xs text-muted-foreground">1 hour ago</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Update available</p>
                      <p className="text-xs text-muted-foreground">3 hours ago</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="link" className="w-full">View all notifications</Button>
                </CardFooter>
              </Card>

              <Card className="transition-smooth hover:shadow-soft">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Frequently used tools</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                      <Plus className="h-6 w-6" />
                      <span className="text-xs">Create</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                      <Upload className="h-6 w-6" />
                      <span className="text-xs">Upload</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                      <Search className="h-6 w-6" />
                      <span className="text-xs">Search</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                      <Share2 className="h-6 w-6" />
                      <span className="text-xs">Share</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
    </TooltipProvider>
  );
}
