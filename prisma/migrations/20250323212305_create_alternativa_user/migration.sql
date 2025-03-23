/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `AlternativaUsers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AlternativaUsers_username_key" ON "AlternativaUsers"("username");
