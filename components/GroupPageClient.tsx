"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

const GroupPageClient = ({ id }: { id: string }) => {
    const searchParams = useSearchParams();
    const secret = searchParams.get('secret');

    return (
        <div>
            <p>Group ID: {id}</p>
            <p>Secret: {secret}</p>
        </div>
    );
};

export default GroupPageClient;
