import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import Logo from "@/components/Logo";
import { RainbowButton } from "@/components/ui/rainbow-button";

export default async function HomePage() {
  const session = await auth();

  if (!session) {
    // Guest view
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Navbar />
        <Hero />
      </main>
    );
  }

  const { firstName, lastName, currency } = session.user;

  if (!firstName || !lastName || !currency) {
    return <OnboardingRedirect />;
  }

  redirect("/dashboard");
}

function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center py-12 lg:py-20">
      <div className="text-center">
        <span className="text-sm text-primary font-medium tracking-tight bg-primary/10 px-4 py-2 rounded-full">
          Best invoice app in wakanda land
        </span>
        <h1 className="mt-8 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tighter">
          Invoicing made{" "}
          <span className="block bg-gradient-to-l from-blue-500 via-teal-500 to-green-500 text-transparent bg-clip-text tracking-normal">
            with ease!
          </span>
        </h1>

        <p className="max-w-xl mx-auto mt-6 lg:text-lg text-muted-foreground">
          Creating Invoices can be a pain! We make it super easy for you to get
          your paid in time!
        </p>

        <div className="mt-6 mb-12">
          <Link href="/login">
            <RainbowButton className="bg-amber-200 text-rose-700 font-bold hover:bg-amber-300">
              Get Unlimited Access
            </RainbowButton>
          </Link>
        </div>
      </div>

      <div className="relative items-center w-full py-12 mx-auto mt-12">
        <svg
          className="absolute inset-0 -mt-24 blur-3xl"
          style={{ zIndex: -1 }}
          fill="none"
          viewBox="0 0 400 400"
          height="100%"
          width="100%"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_10_20)">
            <g filter="url(#filter0_f_10_20)">
              <path
                d="M128.6 0H0V322.2L106.2 134.75L128.6 0Z"
                fill="#03FFE0"
              ></path>
              <path
                d="M0 322.2V400H240H320L106.2 134.75L0 322.2Z"
                fill="#7C87F8"
              ></path>
              <path
                d="M320 400H400V78.75L106.2 134.75L320 400Z"
                fill="#4C65E4"
              ></path>
              <path
                d="M400 0H128.6L106.2 134.75L400 78.75V0Z"
                fill="#043AFF"
              ></path>
            </g>
          </g>
          <defs>
            <filter
              colorInterpolationFilters="sRGB"
              filterUnits="userSpaceOnUse"
              height="720.666"
              id="filter0_f_10_20"
              width="720.666"
              x="-160.333"
              y="-160.333"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
              <feBlend
                in="SourceGraphic"
                in2="BackgroundImageFix"
                mode="normal"
                result="shape"
              ></feBlend>
              <feGaussianBlur
                result="effect1_foregroundBlur_10_20"
                stdDeviation="80.1666"
              ></feGaussianBlur>
            </filter>
          </defs>
        </svg>
        <Image
          src={`/hero.png`}
          alt="Hero image"
          className="relative object-cover w-full border rounded-lg lg:rounded-2xl shadow-2xl"
          width={400}
          height={400}
          priority
          sizes="100vw"
          style={{
            width: "100%",
            height: "auto",
          }}
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNiYAAAAAEAAGNISwAAAAAASUVORK5CYII="
          unoptimized
          quality={100}
        />
      </div>
    </section>
  );
}

function Navbar() {
  return (
    <div className="flex items-center justify-between py-5 gap-2">
      <Logo />
      <Link href="/login">
        <RainbowButton className="bg-blue-500 text-white font-bold hover:bg-blue-600">
          Login
        </RainbowButton>
      </Link>
    </div>
  );
}

function OnboardingRedirect() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-6">
      <h2 className="text-2xl font-semibold mb-4">Welcome!</h2>
      <p className="mb-6 text-gray-600">
        Please complete your profile to get started.
      </p>
      <Link href="/onboarding">
        <RainbowButton className="bg-amber-200 text-rose-700 font-bold hover:bg-amber-300">
          Complete Profile
        </RainbowButton>
      </Link>
    </div>
  );
}
