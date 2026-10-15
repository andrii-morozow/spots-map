import { z } from "zod";
import { sportTypes, spotTypes, spotStatuses } from "@/constants/spot";
import { ratings, ratingKeys } from "@/constants/spot-ratings";

export const spotIdSchema = z.uuid();

export const ratingSchema = z.union(ratings.map((rating) => z.literal(rating)));

export const spotCreateSchema = z
  .strictObject({
    title: z.string().trim().min(1),
    slug: z
      .string()
      .trim()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    description: z.string().trim().nullable().optional(),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    address: z.string().trim().nullable().optional(),
    city: z.string().trim().nullable().optional(),
    country: z.string().trim().nullable().optional(),
    sportTypes: z.array(z.enum(sportTypes)).default([]),
    spotTypes: z.array(z.enum(spotTypes)).default([]),
    difficulty: ratingSchema.nullable().default(null),
    access: ratingSchema.nullable().default(null),
    runup: ratingSchema.nullable().default(null),
    landing: ratingSchema.nullable().default(null),
    status: z.enum(spotStatuses).default("draft"),
  })
  .superRefine((spot, context) => {
    if (spot.status !== "published") return;
    for (const key of ratingKeys) {
      if (spot[key] === null) {
        context.addIssue({
          code: "custom",
          path: [key],
          message: "Published spots require all four ratings.",
        });
      }
    }
  });

export const spotUpdateSchema = z
  .strictObject({
    title: z.string().trim().min(1),
    slug: z
      .string()
      .trim()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    description: z.string().trim().nullable(),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    address: z.string().trim().nullable(),
    city: z.string().trim().nullable(),
    country: z.string().trim().nullable(),
    sportTypes: z.array(z.enum(sportTypes)),
    spotTypes: z.array(z.enum(spotTypes)),
    difficulty: ratingSchema.nullable(),
    access: ratingSchema.nullable(),
    runup: ratingSchema.nullable(),
    landing: ratingSchema.nullable(),
    status: z.enum(spotStatuses),
  })
  .partial()
  .refine((input) => Object.keys(input).length > 0, {
    message: "Provide at least one field to update.",
  });

export type SpotUpdateInput = z.infer<typeof spotUpdateSchema>;

export type SpotCreateInput = z.infer<typeof spotCreateSchema>;
