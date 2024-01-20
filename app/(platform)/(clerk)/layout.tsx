const ClerkLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="min-h-screen flex items-center justify-center">
			{children}
			<div className="absolute top-0 text-xs bg-slate-100 rounded-md p-3 flex flex-col gap-1 font-semibold">
				<span>use this credential</span>
				<span>email - mokad51546@wentcity.com</span>
				<span>password - zenboard123</span>
			</div>
		</div>
	);
};

export default ClerkLayout;
