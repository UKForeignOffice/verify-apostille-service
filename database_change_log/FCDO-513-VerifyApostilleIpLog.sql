CREATE TABLE IF NOT EXISTS public."VerifyApostilleIpLog"
(
    "Ip" inet NOT NULL,
    "FailedAttempts" integer,
    "Day" smallint,
    CONSTRAINT "VerifyApostilleIpLog_pkey" PRIMARY KEY ("Ip")
)