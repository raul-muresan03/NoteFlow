"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useRef, useState } from "react";

interface TitleProps {
    initialData: Doc<"documents">;
};

export const Title = ({
    initialData
}: TitleProps) => {
    const update = useMutation(api.documents.update);
    const [isEditing, setIsEditing] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const [title, setTitle] = useState(initialData.title || "Untitled");

    const enableInput = () => { //functie care se ocupa de evenimentul de click pentru a edita titlul
        setTitle(initialData.title);
        setIsEditing(true);
        setTimeout(() => {
            inputRef.current?.focus();
            inputRef.current?.setSelectionRange(0, inputRef.current.value.length);
        }, 0);
    };

    const disableInput = () => {
        setIsEditing(false);
    };

    const OnChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => { //functie care se ocupa de evenimentul de change pentru a modifica titlul
        setTitle(event.target.value);
        update({
            id: initialData._id,
            title: event.target.value || "Untitled" //daca nu exista titlu, se va afisa "Untitled"
        });
    };

    const onKeyDown = (
        event: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (event.key === "Enter") {
            disableInput();
        }
    };



    return (
        <div className="flex items-center gap-x-1">
            {!!initialData.icon && <p>{initialData.icon}</p>}
            {isEditing ? (
                <Input
                    ref={inputRef}
                    onClick={enableInput}
                    onBlur={disableInput}
                    onChange={OnChange}
                    onKeyDown={onKeyDown}
                    value={title}

                    className="h-7 px-2 focus-visibile:ring-transparent"
                />
            ) : (
                <Button
                    onClick={enableInput}
                    variant="ghost"
                    size="sm"
                    className="font-normal h-auto p-1"
                >
                    <span className="truncate">
                        {initialData?.title}
                    </span>
                </Button>
            )}
        </div>
    )
}

Title.Skeleton = function TitleSkeleton() {
    return (
        <Skeleton className="h-9 w-16 rounded-md" />
    );
};