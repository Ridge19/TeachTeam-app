import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import * as React from "react";
import { Geist, Geist_Mono } from "next/font/google";
// import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "../context/AuthContext";
import "../styles/globals.css";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
      <AuthProvider>
        <main className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <ChakraProvider>
            <Header />
            <Component {...pageProps} />
          </ChakraProvider>
        </main>
      </AuthProvider>

  );
}