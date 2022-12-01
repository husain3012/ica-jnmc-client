-- CreateEnum
CREATE TYPE "enum_users_role" AS ENUM ('admin', 'hicc', 'medical officer', 'lab', 'default');

-- CreateTable
CREATE TABLE "forms" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "form" JSONB NOT NULL,
    "firstVisit" TIMESTAMPTZ(6),
    "secondVisit" TIMESTAMPTZ(6),
    "thirdVisit" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INT8,

    CONSTRAINT "primary" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "needleForms" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "createdBy" STRING(255) NOT NULL,
    "form" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "primary" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reminders" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "email" STRING(255),
    "phoneNumber" STRING(255),
    "sendAt" TIMESTAMPTZ(6),
    "subject" STRING(255),
    "message" STRING(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "formId" INT8,

    CONSTRAINT "primary" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settings" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "createdBy" STRING(255),
    "emailReminders" BOOL DEFAULT true,
    "whatsappReminders" BOOL DEFAULT false,
    "cronInterval" STRING(255) DEFAULT 'daily',
    "serverCrons" BOOL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "primary" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "user_id" STRING(255),
    "level" INT4 NOT NULL,
    "role" STRING(255) DEFAULT 'default',
    "email" STRING(255) NOT NULL,
    "password" STRING(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "primary" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_user_id_key" ON "users"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "forms" ADD CONSTRAINT "fk_userId_ref_users" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reminders" ADD CONSTRAINT "fk_formId_ref_forms" FOREIGN KEY ("formId") REFERENCES "forms"("id") ON DELETE SET NULL ON UPDATE CASCADE;
