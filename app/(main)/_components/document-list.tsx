"use client";

import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Item } from "./item";
import { cn } from "@/lib/utils";
import { FileIcon } from "lucide-react";

interface DocumentListProps {     //interfata care descrie structura unui obiect
    parentDocumentId: Id<"documents">;
    level?: number;
}

export const DocumentList = ({     //componenta care afiseaza lista de documente    
    parentDocumentId,
    level = 0,
}: DocumentListProps) => {
    const params = useParams();
    const router = useRouter();
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    const onExpand = (documentId: string) => {      //functie care se ocupa de expandarea documentului
        setExpanded((prevExpanded) => {
            console.log("Expanding document:", documentId, !prevExpanded[documentId]);      //prevExpanded - obiectul care contine toate elementele care sunt expandate
            return {            
                ...prevExpanded,        //returneaza un obiect care contine toate elementele din prevExpanded si adauga sau modifica elementul cu cheia documentId
                [documentId]: !prevExpanded[documentId],
            };
        });
    };

    const documents = useQuery(api.documents.getSidebar, {      //foloseste hook-ul useQuery pentru a face un query catre API
        parentDocument: parentDocumentId,
    }) as Doc<"documents">[] | null | undefined;        //returneaza un array de documente sau null sau undefined

    console.log("Documents fetched:", documents);

    const onRedirect = (documentId: string) => {        //functie care se ocupa de redirectionarea catre un document
        router.push(`/documents/${documentId}`);        //cu router.push se redirectioneaza catre o alta pagina
    };

    if (!documents) {       //daca documents este null sau undefined, afiseaza un skeleton
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
            {documents.length === 0 && level > 0 && (       //daca nu exista documente si nivelul este mai mare decat 0, afiseaza un mesaj
                <p
                    style={{
                        paddingLeft: level ? `${level * 12 + 25}px` : undefined,        
                    }}
                    className={cn(      //cn - functie care concateneaza clasele CSS
                        "hidden text-sm font-medium text-muted-foreground/80",      
                        level > 0 && "block"        //daca nivelul este mai mare decat 0, adauga clasa block
                    )}
                >
                    No pages inside
                </p>
            )}
            {documents.map((document) => {  //pentru fiecare document din documents, afiseaza un Item, care contine un icon, un label si un documentIcon
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
                        {expanded[document._id] && (        //daca documentul este expandat, afiseaza un DocumentList care are ca parinte documentul curent si nivelul + 1
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
