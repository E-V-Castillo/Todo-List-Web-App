import { z } from 'zod'

export const PassportSchema = z.object({
    email: z
        .string({
            required_error: 'Email is required',
            invalid_type_error: 'Email must be a string',
        })
        .max(254, { message: 'Email must be shorter than 254 characters' })
        .email({ message: 'Email must be a valid email' }),
    password: z
        .string({
            required_error: 'Password is required',
            invalid_type_error: 'Password must be a string',
        })
        .max(40, { message: 'Password must be shorter than 40 characters' })
        .min(8, { message: 'Password must be longer than 8 characters' }),
})
