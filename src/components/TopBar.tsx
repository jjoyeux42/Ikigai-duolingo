import dayjs from "dayjs";
import Link from "next/link";
import type { ComponentProps } from "react";
import React, { useState } from "react";
import { useBoundStore } from "~/hooks/useBoundStore";
import { Calendar } from "./Calendar";

// Icônes IKIGAI
const FireSvg = (props: ComponentProps<"svg">) => (
  <svg width="25" height="30" viewBox="0 0 25 30" fill="none" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.9697 2.91035C13.2187 1.96348 11.7813 1.96348 11.0303 2.91035L7.26148 7.66176L4.83362 6.36218C4.61346 6.24433 4.1221 6.09629 3.88966 6.05712C2.72329 5.86056 2.04098 6.78497 2.04447 8.03807L2.06814 16.5554C2.02313 16.9355 2 17.322 2 17.7137C2 23.2979 6.70101 27.8248 12.5 27.8248C18.299 27.8248 23 23.2979 23 17.7137C23 15.3518 22.1591 13.1791 20.7498 11.4581L13.9697 2.91035Z"
      fill="white"
    />
  </svg>
);

const PointsSvg = (props: ComponentProps<"svg">) => (
  <svg width="24" height="30" viewBox="0 0 24 30" fill="none" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 27C18.0751 27 23 22.0751 23 16C23 9.92487 18.0751 5 12 5C5.92487 5 1 9.92487 1 16C1 22.0751 5.92487 27 12 27ZM12 19C13.6569 19 15 17.6569 15 16C15 14.3431 13.6569 13 12 13C10.3431 13 9 14.3431 9 16C9 17.6569 10.3431 19 12 19Z"
      fill="white"
    />
  </svg>
);

const MoreOptionsSvg = (props: ComponentProps<"svg">) => (
  <svg width="24" height="30" viewBox="0 0 24 30" fill="none" {...props}>
    <path
      d="M12 17C13.1046 17 14 16.1046 14 15C14 13.8954 13.1046 13 12 13C10.8954 13 10 13.8954 10 15C10 16.1046 10.8954 17 12 17Z"
      fill="white"
    />
    <path
      d="M12 10C13.1046 10 14 9.10457 14 8C14 6.89543 13.1046 6 12 6C10.8954 6 10 6.89543 10 8C10 9.10457 10.8954 10 12 10Z"
      fill="white"
    />
    <path
      d="M12 24C13.1046 24 14 23.1046 14 22C14 20.8954 13.1046 20 12 20C10.8954 20 10 20.8954 10 22C10 23.1046 10.8954 24 12 24Z"
      fill="white"
    />
  </svg>
);

type MenuState = "HIDDEN" | "LANGUAGES" | "STREAK" | "POINTS" | "MORE";

export const TopBar = ({
  backgroundColor = "bg-[#41D185]", // Couleur IKIGAI
  borderColor = "border-[#2CA86E]", // Bordure plus foncée
}: {
  backgroundColor?: `bg-${string}`;
  borderColor?: `border-${string}`;
}) => {
  const [menu, setMenu] = useState<MenuState>("HIDDEN");
  const [now, setNow] = useState(dayjs());
  const streak = useBoundStore((x) => x.streak);
  const points = useBoundStore((x) => x.lingots); // Renommer lingots en points
  const language = useBoundStore((x) => x.language);
  
  return (
    <header className="fixed z-20 h-[58px] w-full">
      <div
        className={`relative flex h-full w-full items-center justify-between border-b-2 px-[10px] transition duration-500 sm:hidden ${borderColor} ${backgroundColor}`}
      >
        <Link href="/dashboard" className="text-xl font-bold text-white">
          IKIGAI
        </Link>

        <button
          className="flex items-center gap-2 font-bold text-white"
          onClick={() => setMenu((x) => (x === "STREAK" ? "HIDDEN" : "STREAK"))}
          aria-label="Voir votre série"
        >
          <FireSvg /> <span className="text-white">{streak}</span>
        </button>
        
        <button
          className="flex items-center gap-2 font-bold"
          onClick={() => setMenu((x) => (x === "POINTS" ? "HIDDEN" : "POINTS"))}
          aria-label="Voir vos points"
        >
          <PointsSvg /> <span className="text-white">{points}</span>
        </button>
        
        <MoreOptionsSvg
          onClick={() => setMenu((x) => (x === "MORE" ? "HIDDEN" : "MORE"))}
          role="button"
          tabIndex={0}
          aria-label="Plus d'options"
        />

        <div
          className={[
            "absolute left-0 right-0 top-full bg-white transition duration-300",
            menu === "HIDDEN" ? "opacity-0" : "opacity-100",
          ].join(" ")}
          aria-hidden={menu === "HIDDEN"}
        >
          {((): null | JSX.Element => {
            switch (menu) {
              case "STREAK":
                return (
                  <div className="flex grow flex-col items-center gap-3 p-5">
                    <h2 className="text-xl font-bold">Série</h2>
                    <p className="text-sm text-gray-400">
                      Pratiquez chaque jour pour maintenir votre série !
                    </p>
                    <div className="self-stretch">
                      <Calendar now={now} setNow={setNow} />
                    </div>
                  </div>
                );

              case "POINTS":
                return (
                  <div className="flex grow items-center gap-3 p-5">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#41D185] text-4xl text-white">
                      ✨
                    </div>
                    <div className="flex flex-col gap-3">
                      <h2 className="text-xl font-bold text-black">Points</h2>
                      <p className="text-sm font-normal text-gray-400">
                        Vous avez {points} {points === 1 ? "point" : "points"}.
                      </p>
                      <Link
                        className="font-bold uppercase text-[#41D185] transition hover:brightness-110"
                        href="/rewards"
                      >
                        Voir les récompenses
                      </Link>
                    </div>
                  </div>
                );

              case "MORE":
                return (
                  <div className="flex grow flex-col">
                    <Link
                      className="flex items-center gap-2 p-2 font-bold text-gray-700"
                      href="/profile"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4EAAF0] text-white">
                        👤
                      </div>
                      Mon profil
                    </Link>
                    <Link
                      className="flex items-center gap-2 border-t-2 border-gray-300 p-2 font-bold text-gray-700"
                      href="/settings"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FF8747] text-white">
                        ⚙️
                      </div>
                      Paramètres
                    </Link>
                    <Link
                      className="flex items-center gap-2 border-t-2 border-gray-300 p-2 font-bold text-gray-700"
                      href="/help"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#B069F8] text-white">
                        ❓
                      </div>
                      Aide
                    </Link>
                  </div>
                );

              default:
                return null;
            }
          })()}
          <div
            className={[
              "absolute left-0 top-full h-screen w-screen bg-black opacity-30",
              menu === "HIDDEN" ? "pointer-events-none" : "",
            ].join(" ")}
            onClick={() => setMenu("HIDDEN")}
            aria-label="Masquer le menu"
            role="button"
          ></div>
        </div>
      </div>
    </header>
  );
};