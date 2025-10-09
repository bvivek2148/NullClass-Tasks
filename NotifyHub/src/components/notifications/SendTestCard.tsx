"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function SendTestCard({ userId }: SendTestCardProps) {
  const [channel, setChannel] = useState<"email" | "sms" | "push">("email");
  const [priority, setPriority] = useState<"critical" | "high" | "normal" | "low">("normal");
  const [template, setTemplate] = useState<string>("booking.confirmation");
  const [recipient, setRecipient] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const priorityMap = {
    critical: 10,
    high: 7,
    normal: 5,
    low: 2,
  };

  // Indian-specific sample data
  const templateData = {
    "booking.confirmation": {
      bookingId: "BUS456789",
      route: "Mumbai to Delhi",
      seatNumber: "15A",
      departureTime: "9:30 PM",
      departureDate: "25-03-2024",
      terminal: "Dadar Terminal",
      amount: "₹1,450",
      passengerName: "Vivek Sharma"
    },
    "booking.cancellation": {
      bookingId: "TRN789012",
      route: "Chennai to Bangalore",
      refundAmount: "₹2,340",
      cancellationDate: "20-03-2024",
      processingDays: "5-7 business days",
      passengerName: "Vivek Sharma"
    },
    "promo.offer": {
      discountPercentage: "25%",
      promoCode: "INDIA25",
      route: "Pune to Hyderabad",
      validTill: "31-03-2024",
      maxDiscount: "₹600",
      minBookingAmount: "₹1,200"
    }
  };

  const handleSend = async () => {
    if (!recipient.trim()) {
      toast.error("Please enter a recipient");
      return;
    }
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setSending(true);
    try {
      const response = await fetch("/api/notification/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          type: "transactional",
          priority: priorityMap[priority],
          title,
          content: message,
          channel,
          locale: "en-IN",
          templateKey: template,
          data: templateData[template as keyof typeof templateData] || {},
          recipientOverride: recipient,
        }),
      });

      if (!response.ok) throw new Error("Failed to send notification");

      const data = await response.json();
      toast.success(`Notification sent via ${channel} (Priority: ${priority})`, {
        description: `Notification ID: ${data.id}, Job ID: ${data.jobId}`,
      });

      // Reset form
      setRecipient("");
      setTitle("");
      setMessage("");
    } catch (error) {
      toast.error("Failed to send notification", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Test Notification</CardTitle>
        <CardDescription>
          Send a test notification to verify delivery channels (Indian numbers format: +91 XXXXX XXXXX)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="channel">Channel</Label>
            <Select value={channel} onValueChange={(value) => setChannel(value as typeof channel)}>
              <SelectTrigger id="channel">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="push">Push Notification</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={(value) => setPriority(value as typeof priority)}>
              <SelectTrigger id="priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="critical">Critical (10)</SelectItem>
                <SelectItem value="high">High (7)</SelectItem>
                <SelectItem value="normal">Normal (5)</SelectItem>
                <SelectItem value="low">Low (2)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="template">Template</Label>
          <Select value={template} onValueChange={setTemplate}>
            <SelectTrigger id="template">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="booking.confirmation">Booking Confirmation (Mumbai-Delhi)</SelectItem>
              <SelectItem value="booking.cancellation">Booking Cancellation (Chennai-Bangalore)</SelectItem>
              <SelectItem value="promo.offer">Promotional Offer (Pune-Hyderabad)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="recipient">
            Recipient {channel === "email" ? "Email" : channel === "sms" ? "Phone (+91)" : "Device Token"}
          </Label>
          <Input
            id="recipient"
            placeholder={
              channel === "email"
                ? "vivek.sharma@example.com"
                : channel === "sms"
                ? "+91 98765 43210"
                : "fcm_device_token_here"
            }
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Notification Title</Label>
          <Input
            id="title"
            placeholder="Bus Booking Confirmed - Mumbai to Delhi"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Message Content</Label>
          <Textarea
            id="message"
            placeholder="Your journey from Mumbai to Delhi has been confirmed. Seat: 15A, Departure: 9:30 PM..."
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <Button onClick={handleSend} disabled={sending} className="w-full gap-2">
          {sending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Send Notification
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}