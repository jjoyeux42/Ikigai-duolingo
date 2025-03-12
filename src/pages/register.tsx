import type { NextPage } from "next";
import Link from "next/link";
import { islands } from "~/utils/islands";
import { LanguageHeader } from "~/components/LanguageHeader";
import { useBoundStore } from "~/hooks/useBoundStore";

const Register: NextPage = () => {
  const setActiveIsland = useBoundStore((x) => x.setLanguage); // Réutilisation de la fonction existante
  
  return (
    <main className="flex min-h-screen flex-col items-center bg-[#fffff] text-[#3AD278]">
      <LanguageHeader />
      <div className="container flex grow flex-col items-center justify-center gap-20 px-4 py-16">
        <h1 className="mt-20 text-center text-3xl font-extrabold tracking-tight text-white">
          Je souhaite explorer...
        </h1>
        <section className="mx-auto grid w-full max-w-5xl grow grid-cols-1 flex-col gap-x-2 gap-y-3 sm:grid-cols-2 md:grid-cols-3">
          {islands.map((island) => (
            <Link
              key={island.id}
              href="/learn"
              className="flex cursor-pointer flex-col items-center gap-4 rounded-2xl border-2 border-b-4 border-gray-400 px-5 py-8 text-xl font-bold hover:bg-gray-300 hover:bg-opacity-20"
              onClick={() => setActiveIsland({ code: island.id, name: island.name })}
            >
              <span className="text-4xl">{island.icon}</span>
              <span>{island.name}</span>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
};

export default Register;