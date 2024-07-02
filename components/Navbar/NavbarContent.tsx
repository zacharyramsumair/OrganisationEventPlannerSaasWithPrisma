"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { ModeToggle } from "../ui/toggle-mode";
import Link from "next/link";
import { Button } from "../ui/button";
import { logout } from "@/actions/auth";

type Props = {
	currentUser: any;
};

const NavbarContent = (props: Props) => {
	const { currentUser } = props;

	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const drawerRef = useRef(null);

	const toggleDrawer = () => {
		setIsDrawerOpen(!isDrawerOpen);
	};

	const closeDrawer = () => {
		setIsDrawerOpen(false);
	};

	useEffect(() => {
		const handleOutsideClick = (event: any) => {
			if (drawerRef.current && !drawerRef.current.contains(event.target)) {
				setIsDrawerOpen(false);
			}
		};

		if (isDrawerOpen) {
			document.addEventListener("mousedown", handleOutsideClick);
		} else {
			document.removeEventListener("mousedown", handleOutsideClick);
		}

		return () => {
			document.removeEventListener("mousedown", handleOutsideClick);
		};
	}, [isDrawerOpen]);

	return (
		<header>
			<nav className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-900">
				<div className="flex items-center">
					<div className="lg:hidden">
						<button onClick={toggleDrawer}>
							{isDrawerOpen ? <X /> : <Menu />}
						</button>
					</div>
					<Link href="/" passHref>
						<div className="ml-4 flex items-center space-x-1">
							<p>
								<span className="text-primary text-xl font-bold">
									U
								</span>
								<span className="text-xl font-bold">Events</span>
							</p>
							<sup className="text-xs bg-primary text-white rounded-full px-2 py-1">
								BETA
							</sup>
						</div>
					</Link>
				</div>
				<div className="hidden lg:flex space-x-4 items-center">
					{!currentUser && <Link href="/login">Login</Link>}
					<Link href="/calendar">Calendar</Link>
					{currentUser && currentUser?.organisations?.length > 0 && (
						<Link href="/dashboard">Dashboard</Link>
					)}
					{currentUser && (
						<Button onClick={logout} variant={"ghost"}>
							Logout
						</Button>
					)}
				</div>
				<div className="flex items-center">
					<ModeToggle />
				</div>
			</nav>
			{isDrawerOpen && (
				<div className="lg:hidden fixed inset-0 bg-gray-900 bg-opacity-50 z-50">
					<div
						className="flex flex-col items-start justify-start h-full w-64 bg-white dark:bg-gray-800"
						ref={drawerRef}
					>
						<button className="self-end m-4" onClick={toggleDrawer}>
							<svg
								className="w-6 h-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
						{!currentUser && (
							<Link
								href="/login"
								className="mx-4 my-2"
								onClick={closeDrawer}
							>
								Login
							</Link>
						)}
						<Link
							href="/calendar"
							className="mx-4 my-2"
							onClick={closeDrawer}
						>
							Calendar
						</Link>
						{currentUser && currentUser?.organisations?.length > 0 && (
							<Link
								href="/dashboard"
								className="mx-4 my-2"
								onClick={closeDrawer}
							>
								Dashboard
							</Link>
						)}
						{currentUser && (
							<Button onClick={logout} variant={"ghost"} className="">
								Logout
							</Button>
						)}
					</div>
				</div>
			)}
		</header>
	);
};

export default NavbarContent;
