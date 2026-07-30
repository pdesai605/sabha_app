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
import { demoWhatsAppSent } from "@/lib/demo";
import { useLocaleText } from "@/lib/i18n/locale-text";
import { L } from "@/components/shared/localized";

export interface WhatsAppDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipient: string;
  mobile?: string;
  defaultMessage?: string;
}

export function WhatsAppDialog({
  open,
  onOpenChange,
  recipient,
  mobile,
  defaultMessage = "",
}: WhatsAppDialogProps) {
  const lt = useLocaleText();
  const [message, setMessage] = React.useState(defaultMessage);
  const [fileName, setFileName] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (open) {
      setMessage(defaultMessage);
      setFileName(null);
    }
  }, [open, defaultMessage]);

  const handleSend = () => {
    demoWhatsAppSent();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{lt("Send WhatsApp Message")}</DialogTitle>
          <DialogDescription>{lt("Compose and send a message via WhatsApp.")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{lt("Recipient")}</Label>
            <Input value={recipient} readOnly />
            {mobile && <p className="text-xs text-text-muted">{mobile}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="wa-message">{lt("Message")}</Label>
            <Textarea
              id="wa-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              placeholder={lt("Type your message...")}
            />
          </div>
          <div className="space-y-2">
            <Label>{lt("Attachment")}</Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setFileName("document.pdf")}
              >
                <Paperclip className="size-4" />
                <L>Attach File</L>
              </Button>
              {fileName && <span className="text-xs text-text-muted">{fileName}</span>}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <L>Cancel</L>
          </Button>
          <Button onClick={handleSend} className="bg-[#25D366] hover:bg-[#20BD5A] text-white">
            <Send className="size-4" />
            <L>Send</L>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
