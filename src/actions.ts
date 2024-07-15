'use server';
import { z } from 'zod';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import { ClientsTable } from '../drizzle/schema'; // Adjust the import path

const ClientFormSchema = z.object({
  fullname: z.string().min(1, 'Please enter your full name.'),
  email: z.string().email('Please enter a valid email address.'),
});

export type ClientState = {
  errors?: {
    name?: string[];
    email?: string[];
  };
  message?: string | null;
};

export async function createClient(prevState: ClientState, formData: Record<string, any>) {
  console.log('Form data:', formData); // Log the form data

  const validatedFields = ClientFormSchema.safeParse(formData);
  console.log('Validated fields:', validatedFields); // Log the validation result

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Error llenando formulario. Intente otra vez.',
    };
  }

  const { fullname, email } = validatedFields.data;

  try {
    const db = drizzle(sql);

    await db.insert(ClientsTable).values({
      fullname,
      email,
    }).execute();

  } catch (error) {
    console.error('Database error:', error); // Log detailed error
    return {
      message: 'Su cuenta no pudo ser creada.',
    };
  }
  
}




