"use client";

import { PartialBlock } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";

interface EditorProps {
    onChange: (value: string) => void;
    initialContent?: string;
}

export const Editor = ({
    onChange,
    initialContent,
}: EditorProps) => {
    const { resolvedTheme } = useTheme();
    const editorRef = useRef<HTMLDivElement>(null);

    const editor = useCreateBlockNote({
        initialContent: initialContent ? JSON.parse(initialContent) as PartialBlock[] : undefined,
    });

    useEffect(() => {
        const handleChange = () => {
            const content = JSON.stringify(editor.document);
            onChange(content);
        };

        const observer = new MutationObserver(handleChange);
        const config = { subtree: true, childList: true, characterData: true };

        if (editorRef.current) {
            observer.observe(editorRef.current, config);
        }

        return () => {
            observer.disconnect();
        };

    }, [editor, onChange]);

    return (
        <div ref={editorRef}>
            <BlockNoteView
                theme={resolvedTheme === "dark" ? "dark" : "light"}
                editor={editor}
            />
        </div>
    );
}