"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

type Props = {
    groupsForCombobox: any;
    setValue: any;
    value: any;
	changeValueTotalFunction:any;
};



export function SelectGroupCombobox({  groupsForCombobox, value, setValue,changeValueTotalFunction }: Props) {
	const [open, setOpen] = React.useState(false);

if(!groupsForCombobox){
	return null;
}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-[200px] justify-between"
				>
					{value
						? groupsForCombobox.find((group:any) => group.value === value)
								?.label
						: "Select group..."}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0">
				<Command>
					<CommandInput placeholder="Search group..." />
					<CommandList>
						<CommandEmpty>No group found.</CommandEmpty>
						<CommandGroup>
							{groupsForCombobox.map((group:any) => (
								<CommandItem
									key={group.value}
									value={group.value}
									onSelect={(currentValue: any) => {
										changeValueTotalFunction(
											currentValue === value ? "" : currentValue
										);
										setOpen(false);
									}}
								>
									<Check
										className={cn(
											"mr-2 h-4 w-4",
											value === group.value
												? "opacity-100"
												: "opacity-0"
										)}
									/>
									{group.label}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
