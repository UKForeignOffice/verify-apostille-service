DROP TABLE public."VerifyApostilleIpLog"

CREATE TABLE IF NOT EXISTS public."VerifyApostilleIpLog"
(
    "Ip" inet NOT NULL,
    "FailedAttempts" integer,
    "BlockedAtInMillis" bigint,
    CONSTRAINT "VerifyApostilleIpLog_pkey" PRIMARY KEY ("Ip")
)