"use client";

import * as React from "react";
import { FileText, Image as ImageIcon, Upload, Paperclip } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { demoSuccess } from "@/lib/demo";
import { useLocaleText } from "@/lib/i18n/locale-text";

const DEMO_TYPES = ["PDF", "DOC", "DOCX", "PNG", "JPG"] as const;

function fileIcon(name?: string) {
  const ext = name?.split(".").pop()?.toUpperCase();
  if (ext === "PNG" || ext === "JPG" || ext === "JPEG") {
    return <ImageIcon className="size-12 text-accent-primary" />;
  }
  return <FileText className="size-12 text-accent-primary" />;
}

export interface AttachmentViewerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fileName?: string | null;
  fileType?: string;
  title?: string;
}

export function AttachmentViewerDialog({
  open,
  onOpenChange,
  fileName,
  fileType,
  title = "Attachment",
}: AttachmentViewerDialogProps) {
  const lt = useLocaleText();
  const [uploadFiles, setUploadFiles] = React.useState<File[]>([]);
  const hasFile = Boolean(fileName);

  React.useEffect(() => {
    if (!open) setUploadFiles([]);
  }, [open]);

  const handleUpload = () => {
    demoSuccess("File uploaded successfully.");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{lt(title)}</DialogTitle>
          <DialogDescription>
            {hasFile
              ? lt("Preview attached document for review.")
              : lt("No attachment on record. Upload a supported file.")}
          </DialogDescription>
        </DialogHeader>

        {hasFile ? (
          <div className="rounded-card border border-border-default bg-background-muted/50 p-8 flex flex-col items-center gap-4">
            {fileIcon(fileName ?? undefined)}
            <div className="text-center">
              <p className="text-sm font-medium text-text-primary">{fileName}</p>
              {fileType && (
                <p className="text-xs text-text-muted mt-1">{fileType}</p>
              )}
            </div>
            <div className="w-full h-48 rounded-input border border-dashed border-border-default bg-background-secondary flex items-center justify-center">
              <p className="text-sm text-text-muted">{lt("Document preview (Demo)")}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <FileUpload
              value={uploadFiles}
              onChange={setUploadFiles}
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              multiple
            />
            <p className="text-xs text-text-muted">
              {lt("Supported")}: {DEMO_TYPES.join(", ")}
            </p>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {lt("Close")}
          </Button>
          {hasFile ? (
            <Button onClick={() => demoSuccess("Download started successfully.")}>
              {lt("Download")}
            </Button>
          ) : (
            <Button onClick={handleUpload} disabled={uploadFiles.length === 0}>
              <Upload className="size-4" />
              {lt("Upload")}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function useAttachmentViewer(initial?: { fileName?: string | null; title?: string }) {
  const [open, setOpen] = React.useState(false);
  const [fileName, setFileName] = React.useState<string | null | undefined>(initial?.fileName);
  const [title, setTitle] = React.useState(initial?.title ?? "Attachment");

  const openViewer = (opts?: { fileName?: string | null; title?: string }) => {
    setFileName(opts?.fileName ?? null);
    setTitle(opts?.title ?? "Attachment");
    setOpen(true);
  };

  const dialog = (
    <AttachmentViewerDialog
      open={open}
      onOpenChange={setOpen}
      fileName={fileName}
      title={title}
    />
  );

  return { openViewer, dialog };
}

export function AttachmentButton({
  fileName,
  label = "Attachments",
  variant = "outline" as const,
  size = "sm" as const,
  className,
}: {
  fileName?: string | null;
  label?: string;
  variant?: "outline" | "ghost" | "primary" | "secondary";
  size?: "sm" | "md" | "icon" | "icon-sm";
  className?: string;
}) {
  const lt = useLocaleText();
  const { openViewer, dialog } = useAttachmentViewer({ fileName, title: label });

  return (
    <>
      <Button
        type="button"
        variant={variant}
        size={size}
        className={className}
        onClick={() => openViewer({ fileName, title: label })}
      >
        <Paperclip className="size-4" />
        {size !== "icon" && size !== "icon-sm" && lt(label)}
      </Button>
      {dialog}
    </>
  );
}
