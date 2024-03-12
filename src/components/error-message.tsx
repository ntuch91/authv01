import { cn } from '@/lib/utils';
import React, { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
	message?: string;
}

export default function ErrorMessage({ message, ...rest }: Props) {
	if (!message) return null;
	return (
		<div
			{...rest}
			className={cn(
				rest.className,
				'px-3 py-2 w-full text-xs bg-red-500/15 text-red-500 rounded-md flex items-center gap-2'
			)}>
			{message}
		</div>
	);
}
