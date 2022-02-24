CREATE TABLE IF NOT EXISTS public."VerifyApostilleIpLog"
(
    "Ip" inet NOT NULL,
    "FailedAttempts" integer,
    "BlockedAt" varchar,
    CONSTRAINT "VerifyApostilleIpLog_pkey" PRIMARY KEY ("Ip")
)