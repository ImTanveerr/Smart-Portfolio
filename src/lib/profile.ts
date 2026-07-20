import { cache } from "react";
import { prisma } from "@/lib/prisma";

// Fixed id: there's only ever one Profile row - it doubles as general site
// settings (display counts, resume) beyond just personal bio fields.
export const PROFILE_ID = "profile";

// getProfile() is called from several places that can render in the same
// request (layout, home page, footer). React's cache() dedupes those into a
// single query instead of hitting the database once per caller.
export const getProfile = cache(function getProfile() {
  return prisma.profile.findUnique({ where: { id: PROFILE_ID } });
});
