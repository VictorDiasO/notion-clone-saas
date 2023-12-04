'use client';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { useSearchParams, useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod'

const SignUpFormSchema = z.object({
  email: z.string().describe('Email').email({ message: 'Invalid Email' }),
  password: z.string().describe('Password').min(6, { message: 'Password must be at least 6 characters'}),
  confirmPassword: z.string().describe('Confirm Password').min(6, { message: 'Password must be at least 6 characters'})
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
});

const SignUp = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [submitError, SetSubmitError] = useState('');
  const [confirmation, SetConfirmation] = useState(false);

  const codeExchangeError = useMemo(() => {
    if (!searchParams) return '';
    return searchParams.get('error_description');
  }, [searchParams]);

  const confirmationAndErrorStyles = useMemo(() => {
    clsx('bg-primary', {
      'bg-red-500/10': codeExchangeError,
      'border-red-500/50': codeExchangeError,
      'text-red-700': codeExchangeError,
    })
  }, []);

  const form = useForm<z.infer<typeof SignUpFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: { email: '', password: '', confirmPassword: ''}
  });

  const onSubmit = () => {}

  const signUpHandler = () => {}

  return (
    <Form {...form}>
      <form
        onChange={() => {
          if (submitError) SetSubmitError('');
        }}
        onSubmit={form.handleSubmit(onSubmit)}
      >
      </form>
    </Form>
  )
}

export default SignUp