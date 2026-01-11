import { z } from 'zod';
import type { Channel } from '@/types/business';

/**
 * Validierungsschema für Business Input Daten
 */
export const businessInputSchema = z.object({
  // Säule 1: Datenbank
  totalCustomers: z
    .number()
    .int()
    .min(0, 'Kundenzahl muss mindestens 0 sein')
    .max(1000000, 'Kundenzahl zu hoch'),
  
  averageProjectValue: z
    .number()
    .min(0, 'Projektwert muss positiv sein')
    .max(10000000, 'Projektwert zu hoch'),
  
  contactFrequencyPerYear: z
    .number()
    .min(0, 'Kontaktfrequenz muss mindestens 0 sein')
    .max(365, 'Kontaktfrequenz kann nicht mehr als 365 Tage sein'),
  
  hasReactivationProcess: z.boolean(),

  // Säule 2: Reputation
  googleStarRating: z
    .number()
    .min(1, 'Bewertung muss mindestens 1 Stern sein')
    .max(5, 'Bewertung kann maximal 5 Sterne sein'),
  
  reviewResponseRate: z
    .number()
    .min(0, 'Antwortrate muss mindestens 0% sein')
    .max(100, 'Antwortrate kann maximal 100% sein'),
  
  sharesReviewsOnSocialMedia: z.boolean(),

  // Säule 3: Lead Capture
  dailyCalls: z
    .number()
    .int()
    .min(0, 'Anrufzahl muss mindestens 0 sein')
    .max(10000, 'Anrufzahl zu hoch'),
  
  callAnswerRate: z
    .number()
    .min(0, 'Annahmequote muss mindestens 0% sein')
    .max(100, 'Annahmequote kann maximal 100% sein'),
  
  hasAfterHoursHandling: z.boolean(),

  // Säule 4: Omnichannel
  availableChannels: z
    .array(z.enum(['phone', 'email', 'live_chat', 'social_media', 'sms']))
    .min(1, 'Mindestens ein Kanal muss ausgewählt sein')
    .max(5, 'Maximal 5 Kanäle möglich'),
  
  averageResponseTimeHours: z
    .number()
    .min(0, 'Antwortzeit muss mindestens 0 Stunden sein')
    .max(168, 'Antwortzeit kann maximal 168 Stunden (1 Woche) sein'),

  // Säule 5: Website
  monthlyWebsiteVisitors: z
    .number()
    .int()
    .min(0, 'Besucherzahl muss mindestens 0 sein')
    .max(100000000, 'Besucherzahl zu hoch'),
  
  conversionRate: z
    .number()
    .min(0, 'Konversionsrate muss mindestens 0% sein')
    .max(100, 'Konversionsrate kann maximal 100% sein'),
  
  isMobileOptimized: z.boolean(),
  
  hasAutomatedFollowUp: z.boolean(),
  
  websiteLoadTime: z
    .number()
    .min(0, 'Ladezeit muss positiv sein')
    .max(60, 'Ladezeit zu hoch')
    .optional(),
});

/**
 * Type inference from schema
 */
export type BusinessInputValidated = z.infer<typeof businessInputSchema>;

/**
 * Validierungsschema für App-Einstellungen
 */
export const appSettingsSchema = z.object({
  currency: z.enum(['USD', 'EUR', 'GBP', 'CHF']),
  language: z.enum(['de', 'en']),
  theme: z.enum(['light', 'dark', 'auto']),
  customBenchmarks: z.object({
    database: z.object({
      reactivationRate: z.number().min(0).max(1).optional(),
    }).optional(),
    reputation: z.object({
      targetRating: z.number().min(1).max(5).optional(),
      revenueIncreasePerStar: z.number().min(0).max(1).optional(),
    }).optional(),
    leadCapture: z.object({
      conversionRate: z.number().min(0).max(1).optional(),
    }).optional(),
    omnichannel: z.object({
      omnichannelConversionRate: z.number().min(0).max(1).optional(),
      singleChannelConversionRate: z.number().min(0).max(1).optional(),
    }).optional(),
    website: z.object({
      targetConversionRate: z.number().min(0).max(1).optional(),
    }).optional(),
  }).optional(),
});

/**
 * Helper: Validiert Input-Daten und gibt Ergebnis zurück
 */
export function validateBusinessInput(data: unknown) {
  return businessInputSchema.safeParse(data);
}

/**
 * Helper: Validiert Settings und gibt Ergebnis zurück
 */
export function validateAppSettings(data: unknown) {
  return appSettingsSchema.safeParse(data);
}
