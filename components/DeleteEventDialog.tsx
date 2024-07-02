import { useState } from "react";
import { motion } from "framer-motion"; // Import motion from Framer Motion
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { Trash } from "lucide-react"; // Import Lucide icon for delete
// import { fetchDeleteEvent } from "@/app/api/event/deleteEvent/route";

export function DeleteEventDialog({ eventId }: { eventId: string }) {
	const router = useRouter();
	const [isDeleting, setIsDeleting] = useState(false);

	const pressDeleteEventButton = async () => {
		setIsDeleting(true);
		// await fetchDeleteEvent(eventId);
		window.location.reload(); // Reload the page after deletion
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className="" variant="destructive">
					<motion.div
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.9 }}
						className="flex items-center space-x-1"
					>
						<Trash size={18} strokeWidth={2} />
						<span>Delete</span>
					</motion.div>
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Delete this Event</DialogTitle>
				</DialogHeader>
				<DialogContent>
					<p className="text-sm  mb-4">
						Are you sure you want to delete this event? This action cannot
						be undone.
					</p>

					<div className="">
						<DialogClose asChild className="mx-1">
							<Button type="button" variant="secondary">
								Cancel
							</Button>
						</DialogClose>

						<Button
							type="button"
							variant="destructive"
							onClick={pressDeleteEventButton}
							disabled={isDeleting}
              className="mx-1"
						>
							{isDeleting ? "Deleting..." : "Confirm Delete"}
						</Button>
					</div>
				</DialogContent>
				<DialogFooter className="sm:justify-start"></DialogFooter>
			</DialogContent>
		</Dialog>
	);
}