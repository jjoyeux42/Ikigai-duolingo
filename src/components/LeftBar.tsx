import Link from "next/link";
import type { ComponentProps } from "react";
import React, { useState } from "react";
import type { Tab } from "./BottomBar";
import { useBottomBarItems } from "./BottomBar";
import type { LoginScreenState } from "./LoginScreen";
import { LoginScreen } from "./LoginScreen";
import { useBoundStore } from "~/hooks/useBoundStore";

const LeftBarMoreMenuSvg = (props: ComponentProps<"svg">) => {
  return (
    <svg width="46" height="46" viewBox="0 0 46 46" fill="none" {...props}>
      <circle
        cx="23"
        cy="23"
        r="19"
        fill="#41D185"
        stroke="#41D185"
        strokeWidth="2"
      />
      <circle cx="15" cy="23" r="2" fill="white" />
      <circle cx="23" cy="23" r="2" fill="white" />
      <circle cx="31" cy="23" r="2" fill="white" />
    </svg>
  );
};

// Icônes personnalisées pour IKIGAI
const SupportIconSvg = (props: ComponentProps<"svg">) => {
  return (
    <svg width="46" height="46" viewBox="0 0 46 46" fill="none" {...props}>
      <circle cx="23" cy="23" r="19" fill="#4EAAF0" stroke="#4EAAF0" strokeWidth="2" />
      <path d="M23 14C19.13 14 16 17.13 16 21H19C19 18.79 20.79 17 23 17C25.21 17 27 18.79 27 21C27 22.15 26.37 23.59 25.23 24.74L24.71 25.25C23.64 26.33 23 27.63 23 29V30H26V29C26 28.36 26.32 27.77 26.88 27.21L27.41 26.67C29.07 25.01 30 22.85 30 21C30 17.13 26.87 14 23 14ZM22 31V34H26V31H22Z" fill="white"/>
    </svg>
  );
};

const InfoIconSvg = (props: ComponentProps<"svg">) => {
  return (
    <svg width="46" height="46" viewBox="0 0 46 46" fill="none" {...props}>
      <circle cx="23" cy="23" r="19" fill="#FF8747" stroke="#FF8747" strokeWidth="2" />
      <path d="M23 14C18.58 14 15 17.58 15 22C15 26.42 18.58 30 23 30C27.42 30 31 26.42 31 22C31 17.58 27.42 14 23 14ZM24 26H22V22H24V26ZM24 20H22V18H24V20Z" fill="white"/>
    </svg>
  );
};

export const LeftBar = ({ selectedTab }: { selectedTab: Tab | null }) => {
  const loggedIn = useBoundStore((x) => x.loggedIn);
  const logOut = useBoundStore((x) => x.logOut);

  const [moreMenuShown, setMoreMenuShown] = useState(false);
  const [loginScreenState, setLoginScreenState] =
    useState<LoginScreenState>("HIDDEN");

  const bottomBarItems = useBottomBarItems();

  return (
    <>
      <nav className="fixed bottom-0 left-0 top-0 hidden flex-col gap-5 border-r-2 border-[#e5e5e5] bg-white p-3 md:flex lg:w-64 lg:p-5">
        <Link
          href="/dashboard"
          className="mb-5 ml-5 mt-5 hidden text-3xl font-bold text-[#41D185] lg:block"
        >
          IKIGAI
        </Link>
        <ul className="flex flex-col items-stretch gap-3">
          {bottomBarItems.map((item) => {
            return (
              <li key={item.href} className="flex flex-1">
                {item.name === selectedTab ? (
                  <Link
                    href={item.href}
                    className="flex grow items-center gap-3 rounded-xl border-2 border-[#84d8ff] bg-[#ddf4ff] px-2 py-1 text-sm font-bold uppercase text-blue-400"
                  >
                    {item.icon}{" "}
                    <span className="sr-only lg:not-sr-only">{item.name}</span>
                  </Link>
                ) : (
                  <Link
                    href={item.href}
                    className="flex grow items-center gap-3 rounded-xl px-2 py-1 text-sm font-bold uppercase text-gray-400 hover:bg-gray-100"
                  >
                    {item.icon}{" "}
                    <span className="sr-only lg:not-sr-only">{item.name}</span>
                  </Link>
                )}
              </li>
            );
          })}
          <div
            className="relative flex grow cursor-default items-center gap-3 rounded-xl px-2 py-1 font-bold uppercase text-gray-400 hover:bg-gray-100"
            onClick={() => setMoreMenuShown((x) => !x)}
            onMouseEnter={() => setMoreMenuShown(true)}
            onMouseLeave={() => setMoreMenuShown(false)}
            role="button"
            tabIndex={0}
          >
            <LeftBarMoreMenuSvg />{" "}
            <span className="hidden text-sm lg:inline">Plus</span>
            <div
              className={[
                "absolute left-full top-[-10px] min-w-[300px] rounded-2xl border-2 border-gray-300 bg-white text-left text-gray-400",
                moreMenuShown ? "" : "hidden",
              ].join(" ")}
            >
              <div className="flex flex-col py-2">
                <Link
                  className="flex items-center gap-4 px-5 py-2 text-left uppercase hover:bg-gray-100"
                  href="/about"
                >
                  <InfoIconSvg className="h-10 w-10" />
                  À propos d'IKIGAI
                </Link>
                <Link
                  className="flex items-center gap-4 px-5 py-2 text-left uppercase hover:bg-gray-100"
                  href="/support"
                >
                  <SupportIconSvg className="h-10 w-10" />
                  Support
                </Link>
              </div>
              <div className="flex flex-col border-t-2 border-gray-300 py-2">
                {!loggedIn && (
                  <button
                    className="px-5 py-2 text-left uppercase hover:bg-gray-100"
                    onClick={() => setLoginScreenState("SIGNUP")}
                  >
                    Créer un profil
                  </button>
                )}
                <Link
                  className="px-5 py-2 text-left uppercase hover:bg-gray-100"
                  href={loggedIn ? "/settings/account" : "/settings/preferences"}
                >
                  Paramètres
                </Link>
                <Link
                  className="px-5 py-2 text-left uppercase hover:bg-gray-100"
                  href="/help"
                >
                  Aide
                </Link>
                {!loggedIn && (
                  <button
                    className="px-5 py-2 text-left uppercase hover:bg-gray-100"
                    onClick={() => setLoginScreenState("LOGIN")}
                  >
                    Se connecter
                  </button>
                )}
                {loggedIn && (
                  <button
                    className="px-5 py-2 text-left uppercase hover:bg-gray-100"
                    onClick={logOut}
                  >
                    Se déconnecter
                  </button>
                )}
              </div>
            </div>
          </div>
        </ul>
      </nav>
      <LoginScreen
        loginScreenState={loginScreenState}
        setLoginScreenState={setLoginScreenState}
      />
    </>
  );
};