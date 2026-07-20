import { cache } from "react";
import { prisma } from "@/lib/prisma";

export const PROFILE_ID = "profile";

export const getProfile = cache(function getProfile() {
  return prisma.profile.findUnique({ where: { id: PROFILE_ID } });
});
