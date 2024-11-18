"use client";

import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Item } from "./item";
import { cn } from "@/lib/utils";
import { FileIcon } from "lucide-react";

interface DocumentListProps {
    parentDocumentId: Id<"documents">;
    level?: number;
}

export const DocumentList = ({
    parentDocumentId,
    level = 0,
}: DocumentListProps) => {
    const params = useParams();
    const router = useRouter();
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    const onExpand = (documentId: string) => {
        setExpanded((prevExpanded) => {
            console.log("Expanding document:", documentId, !prevExpanded[documentId]);
            return {
                ...prevExpanded,
                [documentId]: !prevExpanded[documentId],
            };
        });
    };

    const documents = useQuery(api.documents.getSidebar, {
        parentDocument: parentDocumentId,
    }) as Doc<"documents">[] | null | undefined;

    console.log("Documents fetched:", documents);

    const onRedirect = (documentId: string) => {
        router.push(`/documents/${documentId}`);
    };

    if (!documents) {
        return (
            <>
                <Item.Skeleton level={level} />
                {level === 0 && (
                    <>
                        <Item.Skeleton level={level} />
                        <Item.Skeleton level={level} />
                    </>
                )}
            </>
        );
    }

    return (
        <>
            {documents.length === 0 && level > 0 && (
                <p
                    style={{
                        paddingLeft: level ? `${level * 12 + 25}px` : undefined,
                    }}
                    className={cn(
                        "hidden text-sm font-medium text-muted-foreground/80",
                        level > 0 && "block"
                    )}
                >
                    No pages inside
                </p>
            )}
            {documents.map((document) => {
                console.log("Rendering document:", document);
                return (
                    <div key={document._id}>
                        <Item
                            id={document._id}
                            onClick={() => onRedirect(document._id)}
                            label={document.title}
                            icon={FileIcon}
                            documentIcon={document.icon}
                            active={params.documentId === document._id}
                            level={level}
                            onExpand={() => onExpand(document._id)}
                            expanded={expanded[document._id]}
                        />
                        {expanded[document._id] && (
                            <DocumentList
                                parentDocumentId={document._id}
                                level={level + 1}
                            />
                        )}
                    </div>
                );
            })}
        </>
    );
};
