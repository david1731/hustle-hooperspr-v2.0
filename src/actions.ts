'use server';

import { z } from 'zod';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import { ClientsTable } from '../drizzle/schema'; // Adjust the import path

const ClientFormSchema = z.object({
  name: z.string().min(1, 'Please enter your name.'),
  lastname: z.string().min(1, 'Please enter your last name.'),
  phone: z.string().min(10, 'Please enter a valid phone number.'),
  email: z.string().email('Please enter a valid email address.'),
});

export type ClientState = {
  errors?: {
    name?: string[];
    lastname?: string[];
    phone?: string[];
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

  const { name, lastname, phone, email } = validatedFields.data;

  try {
    const db = drizzle(sql);

    await db.insert(ClientsTable).values({
      name,
      lastName: lastname,
      email,
      phoneNum: phone,
    }).execute();

  } catch (error) {
    console.error('Database error:', error); // Log detailed error
    return {
      message: 'Su cuenta no pudo ser creada.',
    };
  }

}




