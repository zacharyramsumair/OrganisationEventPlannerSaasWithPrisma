import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import Navbar from "@/components/Navbar/Navbar";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "UEvents",
	description: "Effortlessly Craft a Calendar of Events with Our application",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await auth();
	return (
		<SessionProvider session={session}>
			<html lang="en" suppressHydrationWarning>
				<body className={inter.className}>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<Navbar />
						<div className="min-h-screen">{children}</div>
					</ThemeProvider>

					<Toaster />
				</body>
			</html>
		</SessionProvider>
	);
}
