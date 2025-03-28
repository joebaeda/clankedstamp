import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import Provider from "./providers/Provider";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const appUrl = "https://clankedstamp.vercel.app";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const ogImageUrl = `${appUrl}/og-image.jpg`;

  return {
    title: "Clanked | Clanker Based",
    description: "One click to launch your cryptocurrency based project to clanker ecosystem",
    openGraph: {
      title: "Clanked | Clanker Based",
      description: "One click to launch your cryptocurrency based project to clanker ecosystem",
      url: appUrl,
      type: 'website',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 600,
          alt: 'Clanker Based',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: "Clanked | Clanker Based",
      description: "One click to launch your cryptocurrency based project to clanker ecosystem",
      images: [ogImageUrl],
    },
    icons: {
      icon: '/favicon.ico',
    },
    other: {
      "fc:frame": JSON.stringify({
        version: "next",
        imageUrl: ogImageUrl,
        button: {
          title: "Mint Clanked Stamp!",
          action: {
            type: "launch_frame",
            name: "Clanked Stamp",
            url: appUrl,
            splashImageUrl: `${appUrl}/splash.png`,
            splashBackgroundColor: "#1b1423",
          },
        },
      }),
    },
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistMono.variable} antialiased bg-[#1b1423]`}
      >
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  );
}
