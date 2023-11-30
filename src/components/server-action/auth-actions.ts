"use server"

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { z } from "zod";
import { cookies } from 'next/headers';
import { FormSchema } from "@/lib/types";

export async function actionLoginUser({ email, password }: z.infer<typeof FormSchema>) {
  const supabase = createRouteHandlerClient({ cookies });
  const response = await supabase.auth.signInWithPassword({
    email,
    password
  });
  return response;
}
