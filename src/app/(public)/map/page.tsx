import NextImage from "next/image";
import kindergarten from "@/assets/дитсад.jpg";

export const PublicMap = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-12 py-16 text-center">
      <div className="relative mb-16 w-full max-w-[600px]">
        <NextImage
          src={kindergarten}
          alt="дитсад"
          width={600}
          className="h-auto max-w-full"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 select-none text-4xl leading-none sm:text-5xl"
        >
          <span className="absolute -top-12 left-[19%] rotate-[165deg] text-[0.7em]">
            🦀
            <span className="absolute top-[-12px] right-[9px] rotate-[20deg] text-[0.45em]">
              🔨
            </span>
          </span>
          <span className="absolute top-[23%] -left-10 rotate-[75deg] text-[1.1em]">
            🦀
            <span className="absolute top-[-19px] left-[12px] rotate-[12deg] text-[0.45em]">
              🔨
            </span>
          </span>
          <span className="absolute bottom-[-12%] right-[15%] -rotate-[60deg] text-[0.7em]">
            🦀
            <span className="absolute top-[-12px] left-[11px] rotate-[30deg] text-[0.45em]">
              🔧
            </span>
          </span>
          <span className="absolute -bottom-12 right-[24%] -rotate-[15deg] text-[1.3em]">
            🦀
            <span className="absolute -top-[22px] right-[16px] rotate-[2deg] text-[0.5em]">
              🗺️
            </span>
          </span>
        </div>
      </div>
      <h1>Welcome to the Spots Map</h1>
      <p>App is under construction. Come back soon.</p>
    </main>
  );
};

export default PublicMap;
