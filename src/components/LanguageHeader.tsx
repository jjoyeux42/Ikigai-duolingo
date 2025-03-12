import Link from "next/link";

export const LanguageHeader = () => {
  return (
    <header className="fixed left-0 right-0 top-0 mx-auto flex min-h-[70px] max-w-5xl items-center justify-between bg-[#41D185] px-10 font-bold text-white">
      <Link className="text-4xl" href="/">
        IKIGAI
      </Link>
      <div className="text-md uppercase">Français</div>
    </header>
  );
};