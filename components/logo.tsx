import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const Logo = () => {
	return (
		<Link href="/">
			<div className="hover:opacity-75 transition hidden md:block">
				<Image src="/logo.svg" alt="logo" height={50} width={100} />
			</div>
		</Link>
	);
};
