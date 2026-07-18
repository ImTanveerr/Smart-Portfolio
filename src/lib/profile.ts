import { prisma } from "@/lib/prisma";

export const PROFILE_ID = "profile";

export function getProfile() {
  return prisma.profile.findUnique({ where: { id: PROFILE_ID } });
}
