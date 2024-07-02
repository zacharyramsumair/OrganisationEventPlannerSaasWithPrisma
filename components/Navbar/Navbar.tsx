import { auth } from "@/auth";
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
