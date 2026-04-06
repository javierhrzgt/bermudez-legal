-- AlterTable
ALTER TABLE "BlogPost" ALTER COLUMN "image" SET DEFAULT '';

-- CreateTable
CREATE TABLE "SiteConfig" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "siteName" TEXT NOT NULL DEFAULT 'Bermudez Legal Consulting',
    "siteDescription" TEXT,
    "logo" TEXT,
    "favicon" TEXT,
    "ogImage" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "street" TEXT,
    "streetNumber" TEXT,
    "zone" TEXT,
    "department" TEXT,
    "city" TEXT,
    "postalCode" TEXT,
    "country" TEXT NOT NULL DEFAULT 'Guatemala',
    "facebook" TEXT,
    "instagram" TEXT,
    "linkedin" TEXT,
    "twitter" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteConfig_pkey" PRIMARY KEY ("id")
);
