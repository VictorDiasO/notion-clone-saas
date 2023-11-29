'use client';
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormSchema } from '@/lib/types';
import { Form } from '@/components/ui/form';
import Link from 'next/link';
import Logo from '../../../../public/cypresslogo.svg';
import Image from 'next/image';

const Login = () => {
  const router = useRouter();
  const [submitError, setSubmitError] = useState('');

  const form = useForm<z.infer<typeof FormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit:SubmitHandler<z.infer<typeof FormSchema>> = async (
    formData
  ) => {
  }

  return (
    <Form {...form}>
      <form
        onChange={() => {
          if (submitError) setSubmitError('');
        }}
        onSubmit={form.handleSubmit(onSubmit)}
        className='w-full sm:justify-center sm:w-[400px] space-y-6 flex flex-col'
      >
        <Link
          href='/'
          className='w-full flex justify-left'
        >
          <Image
            src={Logo}
            alt='Flowcus Logo'
            width={50}
            height={50}
          />
          <span
            className='font-semibold dark:text-white text-4xl first-letter:ml-2'
          >
            flowcus.
          </span>
        </Link>
      </form>
    </Form>
  )
}

export default Login