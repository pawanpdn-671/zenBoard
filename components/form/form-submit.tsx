"use client";

import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface FormSubmitProps {
	children: React.ReactNode;
	disabled?: boolean;
	className?: string;
	variant?: "default" | "destructive" | "outline" | "secondary" | "link" | "primary" | "ghost";
}

export const FormSubmit = ({ children, className, disabled, variant = "primary" }: FormSubmitProps) => {
	const { pending } = useFormStatus();

	return (
		<Button disabled={pending || disabled} type="submit" variant={variant} size="sm" className={cn(className)}>
			{children}
		</Button>
	);
};
