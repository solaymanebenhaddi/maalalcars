import { z } from 'zod'

export const appointmentStatuses = ['CONFIRMED', 'PENDING', 'COMPLETED', 'CANCELLED'] as const

export const appointmentCreateSchema = z.object({
  title: z.string().min(1, 'Titre requis'),
  serviceType: z.string().min(1, 'Type de service requis'),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  status: z.enum(appointmentStatuses).default('CONFIRMED'),
  workshopBay: z.string().nullable().optional(),
  reminderMin: z.coerce.number().int().min(0).default(15),
  notes: z.string().nullable().optional(),
  clientId: z.string().nullable().optional(),
  advisorId: z.string().nullable().optional(),
})

export const appointmentUpdateSchema = appointmentCreateSchema.partial()

export type AppointmentCreateInput = z.infer<typeof appointmentCreateSchema>
export type AppointmentUpdateInput = z.infer<typeof appointmentUpdateSchema>
