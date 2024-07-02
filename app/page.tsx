import HomePage from "@/components/HomePage";
import Image from "next/image";
import { auth } from "@/auth";
import { getUserByEmail } from "@/actions/auth";

export default async function Home() {

  const session = await auth();

	let currentUser: any = false;
	if (session?.user?.email) {
		currentUser = await getUserByEmail(session?.user?.email);
	}

  return (
    // <main className="flex h-full items-center justify-center">
      // <h1 className="text-3xl">Landing page</h1>
      <HomePage currentUser={currentUser}/>
    // </main>
  );
}
