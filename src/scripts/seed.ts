import { prisma } from "../lib/prisma";

const hackathonCategories = [
  { name: "AI / Machine Learning", slug: "ai-machine-learning" },
  { name: "AI", slug: "ai" },
  { name: "Blockchain / Web3", slug: "blockchain-web3" },
  { name: "FinTech", slug: "fintech" },
  { name: "HealthTech", slug: "healthtech" },
  { name: "EdTech", slug: "edtech" },
  { name: "Cybersecurity", slug: "cybersecurity" },
  { name: "Web Development", slug: "web-development" },
  { name: "Application Development", slug: "app-development" },
  { name: "Mobile App Development", slug: "mobile-app-development" },
  { name: "SaaS / Productivity", slug: "saas-productivity" },
  { name: "E-commerce", slug: "e-commerce" },
  { name: "Gaming", slug: "gaming" },
  { name: "IoT / Hardware", slug: "iot-hardware" },
];

async function seedCategory() {
  await prisma.category.createMany({
    data: hackathonCategories,
    skipDuplicates: true,
  });

  console.log("Categories seeded successfully");
}

async function main() {
  try {
    await seedCategory();
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
