'use client';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { IconBrandGoogle, IconBrandGithub } from '@tabler/icons-react';
import Link from 'next/link';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../ui/form';
import { z } from 'zod';
import { LoginSchema } from '@/schemas';
import { login } from '../../server/actions';
import { useState, useTransition } from 'react';
import SocialSignIn from './social-signin';
import { useSearchParams } from 'next/navigation';
import ErrorMessage from '../error-message';

export function LoginForm() {
	// Error State
	const [error, setError] = useState('');

	// Read Errors from searchparams
	const searchparams = useSearchParams();
	const urlError =
		searchparams.get('error') === 'OAuthAccountNotLinked'
			? 'You signed up with a different method, please sign in with the same provider.'
			: '';

	// shadcn form
	const form = useForm<z.infer<typeof LoginSchema>>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	// Form Status
	const [isPending, startTransition] = useTransition();

	// Server Action Call
	const handleSubmit = (values: z.infer<typeof LoginSchema>) => {
		setError('');
		startTransition(() =>
			login(values).then((data) => {
				if (data?.error) setError(data.error);
			})
		);
	};

	return (
		<Card className='mx-auto rounded-none sm:rounded-md w-[350px]'>
			<CardHeader>
				<CardTitle>Login</CardTitle>
				<CardDescription className='tracking-tighter'>
					The route becomes the destination
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)}>
						<div className='grid w-full items-center gap-4'>
							<div className='flex flex-col space-y-1.5'>
								<FormField
									control={form.control}
									name='email'
									render={({ field }) => (
										<FormItem>
											<FormLabel htmlFor='email'>Email</FormLabel>
											<FormControl>
												<Input
													{...field}
													placeholder='the.obedient@sealteam.com'
													aria-disabled={isPending}
													disabled={isPending}
												/>
											</FormControl>
											<FormMessage className='text-xs' />
										</FormItem>
									)}
								/>
							</div>
							<div className='flex flex-col space-y-1.5'>
								<FormField
									control={form.control}
									name='password'
									render={({ field }) => (
										<FormItem>
											<FormLabel htmlFor='password'>Password</FormLabel>
											<FormControl>
												<Input
													{...field}
													type='password'
													aria-disabled={isPending}
													disabled={isPending}
												/>
											</FormControl>
											<FormMessage className='text-xs' />
										</FormItem>
									)}
								/>
							</div>
							{(error || urlError) && <ErrorMessage message={error || urlError} />}
							<div className='flex justify-center pt-3'>
								<Button className='w-1/2' aria-disabled={isPending} disabled={isPending}>
									Login
								</Button>
							</div>
						</div>
					</form>
				</Form>
			</CardContent>
			<CardFooter className='text-center flex flex-col space-y-4'>
				<div className='flex items-center space-x-4 py-4'>
					<SocialSignIn />
				</div>
				<Link href={'/auth/register'} className='text-xs hover:text-muted-foreground'>
					Don&#39;t have an account?
				</Link>
			</CardFooter>
		</Card>
	);
}
