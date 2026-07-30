"use client";

import * as React from "react";
import { Paperclip, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { demoWhatsAppSent } from "@/lib/demo";
import type { GreetingCategory } from "@/modules/office-desk/types";

const CATEGORY_MESSAGES: Record<GreetingCategory, string> = {
  Birthday: "Warmest birthday wishes! May this year bring you good health, happiness, and success. With best regards from the MLA Office.",
  Festival: "Heartfelt greetings on this auspicious occasion. May the festival bring joy, prosperity, and harmony to you and your family. — MLA Office, Pune Central",
  Congratulations: "Heartiest congratulations on this wonderful achievement! Your dedication and hard work are truly inspiring. With warm regards.",
  Condolence: "We share in your sorrow during this difficult time. Please accept our deepest condolences. Our thoughts and prayers are with you and your family.",
  Anniversary: "Warm wishes on your anniversary! May your bond grow stronger with each passing year. With best regards from the MLA Office.",
};

export interface GreetingComposerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipientName: string;
  category: GreetingCategory;
  occasion?: string;
  personId?: string;
}

export function GreetingComposer({
  open,
  onOpenChange,
  recipientName,
  category,
  occasion,
}: GreetingComposerProps) {
  const [message, setMessage] = React.useState("");
  const [attachment, setAttachment] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (open) {
      const base = CATEGORY_MESSAGES[category];
      setMessage(`Dear ${recipientName.split(" ")[0]},\n\n${base}`);
      setAttachment(null);
    }
  }, [open, recipientName, category]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Greeting Composer</DialogTitle>
          <DialogDescription>Compose and send a greeting via WhatsApp.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{category}</Badge>
            {occasion && <Badge variant="default">{occasion}</Badge>}
          </div>
          <div className="space-y-2">
            <Label>Recipient</Label>
            <Input value={recipientName} readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="greeting-message">Message</Label>
            <Textarea
              id="greeting-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={8}
            />
          </div>
          <div className="space-y-2">
            <Label>Attachment</Label>
            <Button type="button" variant="outline" size="sm" onClick={() => setAttachment("greeting-card.png")}>
              <Paperclip className="size-4" />Attach File
            </Button>
            {attachment && <span className="ml-2 text-xs text-text-muted">{attachment}</span>}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            onClick={() => { demoWhatsAppSent(); onOpenChange(false); }}
            className="bg-[#25D366] hover:bg-[#20BD5A] text-white"
          >
            <Send className="size-4" />Send WhatsApp
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
