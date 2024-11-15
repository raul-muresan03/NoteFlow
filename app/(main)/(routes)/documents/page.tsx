"use client"

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react"
import { PlusCircle } from "lucide-react";

const DocumentsPage = () => {
    const { user } = useUser();
    return (
        <div className="h-full flex flex-col items-center justify-center space-y-4">
            <h2>
                Welcome to {user?.firstName}&apos;s NoteFlow
            </h2>
            <Button>
                <PlusCircle className="h-4 w-4 mr-2"/>
                Create a note
            </Button>
        </div>
    );
}

export default DocumentsPage;