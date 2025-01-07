"use client";         //pentru a folosi client-side code, adica code-ul care se executa in browser, nu pe server
//use client se foloseste de exemplu pentru a apasa un buton, pentru a face un fetch catre un API
//cand nu scriem "use client", code-ul se executa implicit pe server

import { useConvexAuth } from "convex/react";
import { Spinner } from "@/components/spinner";
import { redirect } from "next/navigation";
import { Navigation } from "./_components/navigation";


const MainLayout = ({         //componenta care se ocupa de layout-ul paginii principale, care contine meniul de navigare si continutul paginii
    children
}: {
    children: React.ReactNode;
}) => {
    const { isAuthenticated, isLoading } = useConvexAuth();
    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!isAuthenticated) {                         //daca nu este autentificat, il redirectioneaza catre pagina de login
        return redirect("/");
    }

    return (                            //daca este autentificat, afiseaza meniul de navigare si continutul paginii
        <div className="h-full flex dark:bg-[#1F1F1F]">
            <Navigation />
            <main className="flex-1 h-full overflow-y-auto">
                {children}
            </main>
        </div>
    );
}

export default MainLayout;     //exporta componenta MainLayout pentru a fi folosita in alte parti ale aplicatiei