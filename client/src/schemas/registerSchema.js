import { z } from 'zod';

/** Client validation for public registration (kept aligned with existing form rules). */
export const registerSchema = z.object({
  name: z.string().trim().min(1, 'Name cannot be empty'),
  age: z
    .string()
    .trim()
    .min(1, 'Age cannot be empty')
    .refine((val) => /^\d+$/.test(val), 'Age must be a number')
    .refine((val) => Number(val) > 18, 'Age should be above 18'),
  aadharNumber: z
    .string()
    .trim()
    .min(1, 'Aadhar Number cannot be empty')
    .regex(/^\d{12}$/, 'Aadhar should be 12 digits'),
  mobile: z
    .string()
    .trim()
    .min(1, 'Mobile Number cannot be empty')
    .regex(/^\d{10}$/, 'Mobile number should be 10 digits'),
  email: z.string().trim().min(1, 'Email cannot be empty'),
});
