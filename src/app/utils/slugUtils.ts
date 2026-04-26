import slugify from "slugify";
import { prisma } from "../../lib/prisma.js";

const generateUniqueSlug = async (title: string) => {
  const baseSlug = slugify(title, {
    lower: true,
    strict: true,
    trim: true,
  });

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existingHackathon = await prisma.hackathon.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!existingHackathon) break;

    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
};

export const SlugUtils = {
  generateUniqueSlug,
};
