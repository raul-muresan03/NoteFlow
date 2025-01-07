import Image from "next/image"

export const Heroes = () => {
    return (
        <div className="flex flex-col items-center justify-center max-w-5xl">
            <div className="flex items-center">
                <div className="relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px]">
                    <Image
                        src="/hero.webp"
                        fill
                        className="object-contain dark:hidden"
                        alt="hero"
                    />

                    <Image
                        src="/dark_hero.png"
                        fill
                        className="object-contain hidden dark:block"
                        alt="hero"
                    />
                </div>

            </div>
        </div>
    )
}