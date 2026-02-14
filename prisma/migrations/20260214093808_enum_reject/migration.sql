/*
  Warnings:

  - The values [REJECTED] on the enum `CommentStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CommentStatus_new" AS ENUM ('APPROVED', 'REJECT');
ALTER TABLE "public"."comments" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "comments" ALTER COLUMN "status" TYPE "CommentStatus_new" USING ("status"::text::"CommentStatus_new");
ALTER TYPE "CommentStatus" RENAME TO "CommentStatus_old";
ALTER TYPE "CommentStatus_new" RENAME TO "CommentStatus";
DROP TYPE "public"."CommentStatus_old";
ALTER TABLE "comments" ALTER COLUMN "status" SET DEFAULT 'APPROVED';
COMMIT;
