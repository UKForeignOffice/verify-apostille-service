CREATE TABLE IF NOT EXISTS public."VerifyApostilleIpLog"
(
    "Ip" inet NOT NULL,
    "FailedAttempts" integer,
    "FirstFailedAttemptAt" varchar(27),
    "BlockedAt" varchar(27),
    CONSTRAINT "VerifyApostilleIpLog_pkey" PRIMARY KEY ("Ip")
)