
'use server'

import { createClient } from '@/app/lib/supabase/server';
import { SignupSchema, LoginSchema } from '../auth-definitions';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

export async function loginWithGoogle() {
  const supabase = await createClient();
  const origin = (await headers()).get('origin');
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error);
    // Ideally handle this error gracefully on UI
    redirect('/login?error=oauth_failed');
  }

  if (data.url) {
    redirect(data.url);
  }
}

export async function signup(prevState: unknown, formData: FormData) {
  const validatedFields = SignupSchema.safeParse(Object.fromEntries(formData));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = validatedFields.data;
  const supabase = await createClient();

  // 1. Sign up with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
    },
  });

  if (authError) {
    return { message: authError.message };
  }

  if (authData.user) {
    // 2. Insert into public.users table to match our schema and relations
    const { error: dbError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id, // Important: matching IDs
        name: name,
        email: email,
      });
      
    if (dbError) {
       console.error('Error creating public user:', dbError);
       // Should probably rollback auth or handle gracefully, doing basics here.
       return { message: 'Failed to create user profile.' };
    }
  }

  redirect('/login?message=Registration successful, please login.');
}

export async function login(prevState: unknown, formData: FormData) {
  const validatedFields = LoginSchema.safeParse(Object.fromEntries(formData));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { message: 'Invalid login credentials' };
  }

  revalidatePath('/', 'layout');
  redirect('/');
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/login');
}
