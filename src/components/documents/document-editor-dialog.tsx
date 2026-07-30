"use client";

import * as React from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Download,
  Eye,
  FileText,
  Image,
  Italic,
  List,
  ListOrdered,
  Mail,
  MessageCircle,
  Printer,
  Redo,
  Save,
  Share2,
  Table,
  Underline,
  Undo,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  demoExported,
  demoPrinted,
  demoSaved,
  demoSuccess,
  demoWhatsAppSent,
} from "@/lib/demo";

export const DEMO_PLACEHOLDERS: Record<string, string> = {
  "{{Recipient}}": "Hon. District Collector",
  "{{Address}}": "Collector Office, Pune — 411001",
  "{{Ward}}": "Ward 1 — Shivajinagar",
  "{{Subject}}": "Regarding civic infrastructure development",
  "{{Reference}}": "Ref: MLA/PC/2026/1847",
  "{{Date}}": "25 July 2026",
  "{{Sender}}": "Hon. MLA — Pune Central Constituency",
};

const DEFAULT_CONTENT = `<div style="text-align:center;margin-bottom:24px"><strong>OFFICE OF THE MEMBER OF LEGISLATIVE ASSEMBLY</strong><br/>Pune Central Constituency</div>
<p>Date: {{Date}}</p>
<p>Ref: {{Reference}}</p>
<p>To,<br/>{{Recipient}}<br/>{{Address}}</p>
<p><strong>Subject:</strong> {{Subject}}</p>
<p>Respected Sir/Madam,</p>
<p>I am writing to bring to your kind attention the ongoing civic issues in {{Ward}}. The residents have requested immediate intervention for road repairs, drainage clearance, and street lighting improvements.</p>
<p>Kindly treat this matter as urgent and provide a status update at the earliest convenience.</p>
<p>Thanking you,</p>
<p><br/><br/>{{Sender}}<br/><em>Member of Legislative Assembly</em></p>
<div style="margin-top:48px;border-top:1px solid #ccc;padding-top:8px;text-align:center;font-size:11px;color:#666">Office of MLA — Pune Central | Phone: 020-25501234</div>`;

function applyPlaceholders(html: string): string {
  let result = html;
  for (const [key, value] of Object.entries(DEMO_PLACEHOLDERS)) {
    result = result.replaceAll(key, value);
  }
  return result;
}

function ToolbarButton({
  onClick,
  active,
  children,
  label,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <Button
      type="button"
      variant={active ? "secondary" : "ghost"}
      size="icon-sm"
      onClick={onClick}
      aria-label={label}
      title={label}
    >
      {children}
    </Button>
  );
}

export interface DocumentEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  initialContent?: string;
  mode?: "template" | "draft";
}

export function DocumentEditorDialog({
  open,
  onOpenChange,
  title,
  initialContent,
  mode = "draft",
}: DocumentEditorDialogProps) {
  const editorRef = React.useRef<HTMLDivElement>(null);
  const [margin, setMargin] = React.useState("normal");
  const [showLetterhead, setShowLetterhead] = React.useState(true);
  const [showSignature, setShowSignature] = React.useState(true);
  const [previewOpen, setPreviewOpen] = React.useState(false);

  React.useEffect(() => {
    if (open && editorRef.current) {
      editorRef.current.innerHTML = applyPlaceholders(initialContent ?? DEFAULT_CONTENT);
    }
  }, [open, initialContent]);

  const exec = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const insertTable = () => {
    exec(
      "insertHTML",
      `<table border="1" cellpadding="8" cellspacing="0" style="width:100%;border-collapse:collapse;margin:12px 0"><tr><td>Column 1</td><td>Column 2</td></tr><tr><td>Data</td><td>Data</td></tr></table>`
    );
  };

  const insertImage = () => {
    exec(
      "insertHTML",
      `<img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='120'%3E%3Crect fill='%23f0f0f0' width='200' height='120'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-size='14'%3EImage%3C/text%3E%3C/svg%3E" alt="Attachment" style="max-width:200px;margin:8px 0" />`
    );
  };

  const marginClass =
    margin === "narrow" ? "px-8" : margin === "wide" ? "px-20" : "px-14";

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0 gap-0">
          <DialogHeader className="px-6 py-4 border-b border-border-default shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <FileText className="size-5 text-accent-primary" />
              {title}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-wrap items-center gap-1 px-4 py-2 border-b border-border-default bg-background-muted/30 shrink-0">
            <ToolbarButton onClick={() => exec("undo")} label="Undo"><Undo className="size-4" /></ToolbarButton>
            <ToolbarButton onClick={() => exec("redo")} label="Redo"><Redo className="size-4" /></ToolbarButton>
            <Separator orientation="vertical" className="h-6 mx-1" />
            <ToolbarButton onClick={() => exec("bold")} label="Bold"><Bold className="size-4" /></ToolbarButton>
            <ToolbarButton onClick={() => exec("italic")} label="Italic"><Italic className="size-4" /></ToolbarButton>
            <ToolbarButton onClick={() => exec("underline")} label="Underline"><Underline className="size-4" /></ToolbarButton>
            <Separator orientation="vertical" className="h-6 mx-1" />
            <ToolbarButton onClick={() => exec("justifyLeft")} label="Align left"><AlignLeft className="size-4" /></ToolbarButton>
            <ToolbarButton onClick={() => exec("justifyCenter")} label="Align center"><AlignCenter className="size-4" /></ToolbarButton>
            <ToolbarButton onClick={() => exec("justifyRight")} label="Align right"><AlignRight className="size-4" /></ToolbarButton>
            <Separator orientation="vertical" className="h-6 mx-1" />
            <ToolbarButton onClick={() => exec("insertUnorderedList")} label="Bullet list"><List className="size-4" /></ToolbarButton>
            <ToolbarButton onClick={() => exec("insertOrderedList")} label="Numbered list"><ListOrdered className="size-4" /></ToolbarButton>
            <ToolbarButton onClick={insertTable} label="Insert table"><Table className="size-4" /></ToolbarButton>
            <ToolbarButton onClick={insertImage} label="Insert image"><Image className="size-4" /></ToolbarButton>
            <Separator orientation="vertical" className="h-6 mx-1" />
            <Select value={margin} onValueChange={setMargin}>
              <SelectTrigger className="h-8 w-28 text-xs"><SelectValue placeholder="Margins" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="narrow">Narrow</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="wide">Wide</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-1 min-h-0 overflow-hidden">
            <div className="hidden lg:block w-52 shrink-0 border-r border-border-default p-4 space-y-4 overflow-y-auto bg-background-muted/20">
              <div className="space-y-2">
                <Label className="text-xs">Placeholders</Label>
                {Object.keys(DEMO_PLACEHOLDERS).map((key) => (
                  <Button
                    key={key}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-[11px] font-mono h-7"
                    onClick={() => exec("insertText", key)}
                  >
                    {key}
                  </Button>
                ))}
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Options</Label>
                <label className="flex items-center gap-2 text-xs">
                  <input type="checkbox" checked={showLetterhead} onChange={(e) => setShowLetterhead(e.target.checked)} />
                  Letterhead
                </label>
                <label className="flex items-center gap-2 text-xs">
                  <input type="checkbox" checked={showSignature} onChange={(e) => setShowSignature(e.target.checked)} />
                  Signature block
                </label>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-background-muted/40 p-6">
              <div className="mx-auto max-w-[210mm] min-h-[297mm] bg-white shadow-soft rounded-sm border border-border-default">
                {showLetterhead && (
                  <div className="border-b-2 border-accent-primary px-8 py-4 text-center text-sm font-semibold text-accent-primary">
                    OFFICE OF MLA — PUNE CENTRAL
                  </div>
                )}
                <div
                  ref={editorRef}
                  contentEditable
                  suppressContentEditableWarning
                  className={`py-10 ${marginClass} min-h-[240mm] outline-none text-sm leading-relaxed text-text-primary prose prose-sm max-w-none`}
                />
                {showSignature && (
                  <div className={`${marginClass} pb-10 text-sm text-text-muted italic`}>
                    [Signature placeholder — digitally signed in production]
                  </div>
                )}
                <div className="border-t border-border-subtle px-8 py-3 text-center text-[10px] text-text-muted">
                  Footer — Office of MLA, Pune Central Constituency
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-t border-border-default bg-background-secondary shrink-0">
            <div className="flex flex-wrap gap-1">
              <Button variant="outline" size="sm" onClick={() => demoSaved(mode === "template" ? "Template" : "Draft")}>
                <Save className="size-4" />{mode === "template" ? "Save Template" : "Save Draft"}
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPreviewOpen(true)}>
                <Eye className="size-4" />Preview
              </Button>
              <Button variant="outline" size="sm" onClick={() => demoPrinted()}>
                <Printer className="size-4" />Print
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              <Button variant="outline" size="sm" onClick={() => demoExported("PDF")}>
                <Download className="size-4" />PDF
              </Button>
              <Button variant="outline" size="sm" onClick={() => demoExported("DOCX")}>
                <Download className="size-4" />DOCX
              </Button>
              <Button variant="outline" size="sm" onClick={() => demoSuccess("Email sent successfully.")}>
                <Mail className="size-4" />Email
              </Button>
              <Button variant="outline" size="sm" onClick={demoWhatsAppSent} className="text-[#25D366]">
                <MessageCircle className="size-4" />WhatsApp
              </Button>
              <Button variant="outline" size="sm" onClick={() => demoSuccess("Share link copied to clipboard.")}>
                <Share2 className="size-4" />Share
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Print Preview</DialogTitle>
          </DialogHeader>
          <div
            className="prose prose-sm max-w-none p-6 bg-white border border-border-default rounded-input"
            dangerouslySetInnerHTML={{ __html: editorRef.current?.innerHTML ?? "" }}
          />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => demoExported("PDF")}>PDF Preview</Button>
            <Button onClick={() => { demoPrinted(); setPreviewOpen(false); }}>Print</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
