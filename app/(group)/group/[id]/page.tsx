import React from "react";
import { redirect } from "next/navigation";
import { getUserByEmail } from "@/actions/auth";
import { auth } from "@/auth";
import GroupPageClient from "@/components/GroupPageClient";

const Page = async ({ params }: { params: { id: string } }) => {
    const { id } = params;

    const session = await auth();

    let currentUser: any = false;
    if (session?.user?.email) {
        currentUser = await getUserByEmail(session?.user?.email);
    }

    if (!currentUser) {
        redirect("/");
    }

    if (!(currentUser?.organisations?.length > 0)) {
        redirect("/createOrganisation");
    }

    return (
        <div>
            <GroupPageClient id={id} />
        </div>
    );
};

export default Page;
