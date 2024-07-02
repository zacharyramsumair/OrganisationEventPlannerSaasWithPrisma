/**
 * v0 by Vercel.
 * @see https://v0.dev/t/MTIp0jSJz2f
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 * 
 * 
 * https://v0.dev/t/uWfTubiZ3UM
 * 
 * 
 * other footer option
 * https://github.com/shadcn-ui/ui/blob/main/apps/www/components/site-footer.tsx
 * 
 */
import Link from "next/link";

export default function Footer() {
	return (
		<div className="dark bg-gray-900 text-white py-8">
			<div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between">
				<div className="flex items-center space-x-4">
					{/* <Link href="#" className="text-white hover:text-gray-300" prefetch={false}>
            <YoutubeIcon className="h-6 w-6" />
            <span className="sr-only">YouTube</span>
          </Link>
          <Link href="#" className="text-white hover:text-gray-300" prefetch={false}>
            <GithubIcon className="h-6 w-6" />
            <span className="sr-only">GitHub</span>
          </Link>
          <Link href="#" className="text-white hover:text-gray-300" prefetch={false}>
            <TwitterIcon className="h-6 w-6" />
            <span className="sr-only">Twitter</span>
          </Link> */}
					<Link
						href="https://www.instagram.com/zacharyramsumair/"
						className="text-white hover:text-gray-300"
						prefetch={false}
                        target="_blank"
                        rel="noopener noreferrer"
					>
						<InstagramIcon className="h-6 w-6" />
						<span className="sr-only">Instagram</span>
					</Link>
					<Link
						href="https://insigh.to/b/uevents-feedback-and-suggestions"
						className="text-white hover:text-gray-300"
						prefetch={false}
                         target="_blank"
                        rel="noopener noreferrer"
					>
						<FeedbackIcon className="h-6 w-6" />
						<span className="sr-only">Feedback and Suggestions</span>
					</Link>
				</div>
				<p className="mt-4 md:mt-0 text-sm text-gray-300">
					&copy; 2024 UEvents Inc. All rights reserved.
				</p>
			</div>
		</div>
	);
}

function InstagramIcon(props: any) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className="lucide lucide-instagram"
		>
			<rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
			<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
			<line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
		</svg>
	);
}

function TwitterIcon(props: any) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
		</svg>
	);
}

function YoutubeIcon(props: any) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
			<path d="m10 15 5-3-5-3z" />
		</svg>
	);
}

function FeedbackIcon(props: any) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className="lucide lucide-message-circle"
		>
			<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
		</svg>
	);
}