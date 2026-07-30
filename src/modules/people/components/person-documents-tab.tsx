"use client";

import { FileText, Image, File, Download, MoreHorizontal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAttachmentViewer } from "@/components/shared/attachment-viewer-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { PersonDocument } from "@/modules/people/types";
import { formatPersonDateTime } from "@/modules/people/lib/utils";

const typeIcons: Record<string, React.ReactNode> = {
  PDF: <FileText className="size-5" />,
  Image: <Image className="size-5" />,
  Document: <File className="size-5" />,
};

function DocumentCardActions({ doc }: { doc: PersonDocument }) {
  const { openViewer, dialog } = useAttachmentViewer();
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => openViewer({ fileName: doc.name, title: "Documents" })}>
            <Download className="size-4" />
            Download
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {dialog}
    </>
  );
}

interface PersonDocumentsTabProps {
  documents: PersonDocument[];
}

export function PersonDocumentsTab({ documents }: PersonDocumentsTabProps) {
  if (documents.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="flex size-12 items-center justify-center rounded-card bg-background-muted mx-auto mb-3">
            <FileText className="size-6 text-text-muted" />
          </div>
          <p className="text-sm font-medium text-text-primary">No documents</p>
          <p className="text-sm text-text-muted mt-1">
            Uploaded files will appear here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {documents.map((doc) => (
        <Card key={doc.id} className="group hover:border-border-default/80 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-input bg-accent-primary-muted text-accent-primary">
                {typeIcons[doc.type] ?? <File className="size-5" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-text-primary truncate">
                  {doc.name}
                </p>
                <p className="text-xs text-text-muted mt-0.5">
                  {doc.type} · {doc.size}
                </p>
                <p className="text-xs text-text-muted mt-1">
                  {formatPersonDateTime(doc.uploadedAt)} · {doc.uploadedBy}
                </p>
              </div>
              <DocumentCardActions doc={doc} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
