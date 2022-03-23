CREATE TABLE IF NOT EXISTS public."VerifyApostilleIpLog"
(
    "Ip" inet NOT NULL,
    "FailedAttempts" integer,
    "BlockedAt" varchar(27),
    CONSTRAINT "VerifyApostilleIpLog_pkey" PRIMARY KEY ("Ip")
);

-- Without FirstFailedAttemptAt, existing rows will not update this column, so we must drop existing rows
BEGIN;
TRUNCATE "VerifyApostilleIpLog";
ALTER TABLE "VerifyApostilleIpLog" ADD COLUMN "FirstFailedAttemptAt" varchar(27);
COMMIT;