"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const Heading = () => {
    return ( 
        <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
                Your Ideas, Documents & Plans in a Single Place! Welcome
                to <span className="underline">
                    Noteflow
                </span>
            </h1>
            <h3 className="text-base sm:text-xl md:text-2xl font-medium">
                NoteFlow is the connected workspace where <br/>
                better and more organized work happens.
            </h3>
            <Button>
                Enter NoteFlow
                <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
        </div>
     );
}
