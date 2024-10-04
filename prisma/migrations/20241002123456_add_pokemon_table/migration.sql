-- CreateTable
CREATE TABLE "Pokemon" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "height" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "male_gender_ratio" DOUBLE PRECISION NOT NULL,
    "female_gender_ratio" DOUBLE PRECISION NOT NULL,
    "abilities" TEXT[],
    "egg_groups" TEXT[],
    "evolution_description" TEXT NOT NULL,
    "evolution_photo" TEXT[],

    CONSTRAINT "Pokemon_pkey" PRIMARY KEY ("id")
);
