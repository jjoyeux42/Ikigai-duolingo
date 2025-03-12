import { type NextPage } from "next";
import Link from "next/link";
import React from "react";
import { useLoginScreen, LoginScreen } from "~/components/LoginScreen";

const Home: NextPage = () => {
  const { loginScreenState, setLoginScreenState } = useLoginScreen();
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#235390] text-white" style={{ backgroundImage: `url('/bg-pattern.svg')` }}>
      <div className="flex w-full flex-col items-center justify-center gap-3 px-4 py-16 md:flex-row md:gap-36">
        <div className="h-fit w-7/12 md:w-[360px] flex justify-center">
          {/* Logo IKIGAI - un simple cercle avec le texte pour l'instant */}
          <div className="rounded-full bg-white w-48 h-48 flex items-center justify-center text-[#41D185] text-6xl font-bold">
            IKIGAI
          </div>
        </div>
        <div>
          <p className="mb-6 max-w-[600px] text-center text-3xl font-bold md:mb-12">
            L'IA au service de l'équilibre vie pro et vie perso !
          </p>
          <div className="mx-auto mt-4 flex w-fit flex-col items-center gap-3">
            <Link
              href="/register"
              className="w-full rounded-2xl border-b-4 border-green-700 bg-green-600 px-10 py-3 text-center font-bold uppercase transition hover:border-green-600 hover:bg-green-500 md:min-w-[320px]"
            >
              Commencer
            </Link>
            <button
              className="w-full rounded-2xl border-2 border-b-4 border-[#042c60] bg-[#235390] px-8 py-3 font-bold uppercase transition hover:bg-[#204b82] md:min-w-[320px]"
              onClick={() => setLoginScreenState("LOGIN")}
            >
              J'ai déjà un compte
            </button>
          </div>
        </div>
      </div>
      <LoginScreen
        loginScreenState={loginScreenState}
        setLoginScreenState={setLoginScreenState}
      />
    </main>
  );
};

export default Home;