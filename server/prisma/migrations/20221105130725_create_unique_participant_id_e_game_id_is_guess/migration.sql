/*
  Warnings:

  - A unique constraint covering the columns `[participantId,gameId]` on the table `GuessPalpites` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "GuessPalpites_participantId_gameId_key" ON "GuessPalpites"("participantId", "gameId");
