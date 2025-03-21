"use client";;
import { use } from "react";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Toolbar } from "@/components/toolbar";
import { Cover } from "@/components/cover";
import { Editor } from "@/components/editor";

interface DocumentIdPageProps {
  params: Promise<{ documentId: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] }>;
}

const DocumentIdPage = (props: DocumentIdPageProps) => {
  const params = use(props.params);
  const documentId = params.documentId as Id<"documents">;

  const document = useQuery(api.documents.getById, { documentId });
  const update = useMutation(api.documents.update);

  const onChange = (content: string) => {
    update({ id: documentId, content });
  };

  if (document === undefined) return <div>Loading...</div>;
  if (document === null) return <div>Not found</div>;

  return (
    <div className="pb-40">
      <Cover url={document.coverImage} />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <Toolbar initialData={document} />
        <Editor onChange={onChange} initialContent={document.content} />
      </div>
    </div>
  );
};

export default DocumentIdPage;