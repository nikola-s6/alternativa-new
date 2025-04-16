-- CreateTable
CREATE TABLE "Neighborhood" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "responsiblePerson" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Neighborhood_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Neighborhood_value_key" ON "Neighborhood"("value");
