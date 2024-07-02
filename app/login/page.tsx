// Import necessary modules and components
import { signIn } from "@/auth";
import Image from "next/image";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { login } from "@/actions/auth";
import LoginGoogle from "@/components/LoginGoogle";


const Login = async () => {
	const session = await auth();
	console.log(session);
	const user = session?.user;
	if (user) redirect("/");

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
			<div className="max-w-md w-full mx-auto mb-40 p-6 bg-white shadow-lg rounded-lg dark:bg-gray-800">
				<h1 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
					Login
				</h1>


<LoginGoogle/>
				
					{/* <button
						className="relative group/btn flex space-x-4 items-center justify-center px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            onClick={() => login("google")}

					>
						<Image
							src="/google-logo.png"
							width={20}
							height={20}
							alt="Google Logo"
						/>
						<span className="ml-2 text-neutral-700 dark:text-neutral-300 text-sm">
							Sign in with Google
						</span>
					</button> */}
			</div>
		</div>
	);
};

export default Login;
