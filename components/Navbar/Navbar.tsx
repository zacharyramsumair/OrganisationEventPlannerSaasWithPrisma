import { auth } from "@/auth";
import Link from "next/link";

import Image from "next/image";
import Logout from "../Logout";
import { getUserByEmail } from "@/actions/auth";
import NavbarContent from "./NavbarContent";

const Navbar = async () => {
	const session = await auth();

	let currentUser: any = false;
	if (session?.user?.email) {
		currentUser = await getUserByEmail(session?.user?.email);
	}

	return <NavbarContent currentUser={currentUser} />;
};

export default Navbar;
