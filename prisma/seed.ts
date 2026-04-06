import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 12)

  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Administrador",
      password: hashedPassword,
      role: "admin",
    },
  })

  await prisma.siteConfig.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      siteName: "Bermudez Legal Consulting",
      siteDescription: "Consultoría legal especializada en Guatemala. Protegemos sus intereses y acompañamos su crecimiento empresarial.",
      contactEmail: "bermudezlegalconsulting@gmail.com",
      contactPhone: "+502 3056 6897",
      department: "Guatemala",
      city: "Guatemala",
      country: "Guatemala",
    },
  })

  console.log("Seed completado.")
  console.log("- Usuario admin creado:", admin.email)
  console.log("- SiteConfig creado con valores por defecto")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })