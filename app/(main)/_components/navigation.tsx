"use cient"

import { cn } from "@/lib/utils"
import { ChevronsLeft, MenuIcon, Plus, PlusCircle, Search, Settings, Trash } from "lucide-react"
import { useParams, usePathname, useRouter } from "next/navigation"
import { ElementRef, useEffect, useRef, useState } from "react"
import { useMediaQuery } from "usehooks-ts"
import { UserItem } from "./user-item"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Item } from "./item"
import { toast } from "sonner"
import { DocumentList } from "./document-list"
import {
    Popover,
    PopoverTrigger,
    PopoverContent
} from "@/components/ui/popover"

import { useSearch } from "@/hooks/use-search"
import { useSettings } from "@/hooks/use-settings"
import { TrashBox } from "./trash-box"
import { Navbar } from "./navbar"

export const Navigation = () => {
    const isMobile = useMediaQuery("(max-width: 768px)");       //foloseste hook-ul useMediaQuery pentru a verifica daca ecranul este mai mic de 768px
    const pathname = usePathname();     //calea curenta
    const create = useMutation(api.documents.create);
    const search = useSearch();     //foloseste hook-ul useSearch pentru a cauta in documente
    const settings = useSettings();
    const params = useParams();      //parametrii din URL
    const router = useRouter();

    const isResizingRef = useRef(false);    //foloseste hook-ul useRef pentru a crea o referinta la un obiect care contine o valoare booleana 
    const sidebarRef = useRef<ElementRef<"aside">>(null);   //foloseste hook-ul useRef pentru a crea o referinta la un obiect de tip aside
    const navbarRef = useRef<ElementRef<"div">>(null);
    const [isResetting, setIsResetting] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(isMobile);

    useEffect(() => {       //foloseste hook-ul useEffect pentru a face un efect secundar
        if (isMobile) {     //daca ecranul este mai mic de 768px, apeleaza functia collapse
            collapse();
        }
        else {      //
            resetWidth();    //altfel, apeleaza functia resetWidth
        }
    }, [isMobile]);

    useEffect(() => {
        if (isMobile) {
            collapse();
        }
    }, [pathname, isMobile]);

    const handleMouseDown = (   //functie care se ocupa de evenimentul de mousedown pentru a redimensiona meniul
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        event.preventDefault();
        event.stopPropagation();

        isResizingRef.current = true;
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (event: MouseEvent) => {    //functie care se ocupa de evenimentul de mousemove pentru a redimensiona meniul
        if (!isResizingRef.current) return;
        let newWidth = event.clientX;

        if (newWidth < 240) newWidth = 240;
        if (newWidth > 480) newWidth = 480;

        if (sidebarRef.current && navbarRef.current) {
            sidebarRef.current.style.width = `${newWidth}px`;
            navbarRef.current.style.setProperty("left", `${newWidth}px`);
            navbarRef.current.style.setProperty("width", `calc(100%-${newWidth}px)`);
        }
    };

    const handleMouseUp = () => {     //functie care se ocupa de evenimentul de mouseup pentru a opri redimensionarea meniului
        isResizingRef.current = false;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    }

    const resetWidth = () => {     //functie care reseteaza latimea meniului
        if (sidebarRef.current && navbarRef.current) {
            setIsCollapsed(false);
            setIsResetting(true);

            sidebarRef.current.style.width = isMobile ? "100%" : "240px";
            navbarRef.current.style.setProperty(
                "width",
                isMobile ? "0" : "calc(100% - 240px)"
            );
            navbarRef.current.style.setProperty(
                "left",
                isMobile ? "100%" : "240px"
            );
            setTimeout(() => setIsResetting(false), 300);
        }
    };

    const collapse = () => {        //functie care face collapse la meniu
        if (sidebarRef.current && navbarRef.current) {
            setIsCollapsed(true);
            setIsResetting(true);

            sidebarRef.current.style.width = "0";
            navbarRef.current.style.setProperty("width", "100%");
            navbarRef.current.style.setProperty("left", "0");

            setTimeout(() => setIsResetting(false), 300);
        }
    }

    const handleCreate = () => {    //functie care se ocupa de crearea unui nou document
        const promise = create({ title: "Untitled" })
            .then((documentId) => router.push(`/documents/${documentId}`))

        toast.promise(promise, {
            loading: "Creating a new note...",
            success: "New note created!",
            error: "Failed to create a new note.",
        });
    };


    return (
        <>
            <aside      //meniul de navigare
                ref={sidebarRef}
                className={cn(
                    "group/sidebar h0full bg-secondary overflow-y-auto relative flex w-60 flex-col z-[99999]",
                    isResetting && "transition-all ease-in-out duration-300",
                    isMobile && "w-0"       //daca ecranul este mai mic de 768px, latimea meniului este 0
                )}
            >
                <div
                    onClick={collapse}
                    role="button"
                    className={cn(
                        "h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition",
                        isMobile && "opacity-100"
                    )}
                >
                    <ChevronsLeft className="h-6 w-6" />
                </div>
                <div>
                    <UserItem />
                    <Item           //buton search
                        label="Search"
                        icon={Search}
                        isSearch
                        onClick={search.onOpen}

                    />
                    <Item           //buton settings
                        label="Settings"
                        icon={Settings}
                        onClick={settings.onOpen}

                    />
                    <Item           //buton new page
                        onClick={handleCreate}
                        label="New page"
                        icon={PlusCircle}
                    />
                </div>
                <div className="mt-4">
                    <DocumentList />
                    <Item
                        onClick={handleCreate}
                        icon={Plus}
                        label="Add a page"
                    />
                    <Popover>
                        <PopoverTrigger className="w-full mt-4">
                            <Item label="Trash" icon={Trash} />
                        </PopoverTrigger>
                        <PopoverContent
                            className="p-0 w-72"
                            side={isMobile ? "bottom" : "right"}
                        >
                            <TrashBox />
                        </PopoverContent>
                    </Popover>
                </div>
                <div
                    onMouseDown={handleMouseDown}
                    onClick={resetWidth}
                    className="opacity-0 group-hover/sidebar:opacity-100 
                    transition cursor-ew-resize absolute 
                    h-full w-1 bg-primary/10 right-0 top-0"
                />
            </aside>
            <div
                ref={navbarRef}
                className={cn(
                    "absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]",
                    isResetting && "transition-all ease-in-out duration-300",
                    isMobile && "left-0 w-full"
                )}
            >
                {!!params.documentId ? (    //!! converteste valoarea in boolean
                    <Navbar
                        isCollapsed={isCollapsed}
                        onResetWidth={resetWidth}
                    />
                ) : (
                    <nav className="bg-transparent px-3 py-2 w-full">
                        {isCollapsed && <MenuIcon onClick={resetWidth} role="button" className="h-6 w-6 text-muted-foreground" />}
                    </nav>
                )}
            </div>
        </>
    )
} 