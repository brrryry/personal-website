import { Inter } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "bryan",
	description: "a typical cs portfolio",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<main>
					<Navbar />
					{children}
					<footer className="bg-transparent py-10">
						<p>
							made with{" "}
							<a href="https://nextjs.org/" target="_blank">
								next.js
							</a>{" "}
							and <a href="https://tailwindcss.com/">tailwindcss</a> (although it
							doesnt look like it lol)
						</p>
						<p>no laptops were harmed in the making of this website.</p>
						<p>
							source code available{" "}
							<a href="https://github.com/brrryry/personal-website" target="_blank">
								here
							</a>
						</p>
					</footer>
				</main>
			</body>
		</html>
	);
}
