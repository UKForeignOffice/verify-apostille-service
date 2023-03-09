--
-- PostgreSQL database dump
--

-- Dumped from database version 14.6 (Debian 14.6-1.pgdg110+1)
-- Dumped by pg_dump version 14.2

-- Started on 2023-01-12 16:10:35 GMT

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 209 (class 1259 OID 16385)
-- Name: Verify-apostilles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Verify-apostilles" (
    id integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Verify-apostilles" OWNER TO postgres;

--
-- TOC entry 210 (class 1259 OID 16388)
-- Name: Verify-apostilles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Verify-apostilles_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Verify-apostilles_id_seq" OWNER TO postgres;

--
-- TOC entry 3338 (class 0 OID 0)
-- Dependencies: 210
-- Name: Verify-apostilles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Verify-apostilles_id_seq" OWNED BY public."Verify-apostilles".id;


--
-- TOC entry 211 (class 1259 OID 16389)
-- Name: VerifyApostille; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."VerifyApostille" (
    "UID" numeric NOT NULL,
    "ApostilleNumber" character varying(250) NOT NULL,
    "DateIssued" timestamp without time zone NOT NULL,
    "SignedBy" character varying(500),
    "ActingCapacityOf" character varying(255),
    "BearsStampSeal" character varying(256),
    "IssuedBy" character varying(500),
    "DateApostilleCreated" timestamp without time zone NOT NULL,
    "DateApostilleUpdated" timestamp without time zone NOT NULL,
    "DateInserted" timestamp without time zone DEFAULT now() NOT NULL,
    "DateUpdated" timestamp without time zone DEFAULT now() NOT NULL,
    id numeric,
    "ApostilleType" text DEFAULT 'paper'::text
);


ALTER TABLE public."VerifyApostille" OWNER TO postgres;

--
-- TOC entry 212 (class 1259 OID 16397)
-- Name: VerifyApostilleIpLog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."VerifyApostilleIpLog" (
    "Ip" inet NOT NULL,
    "FailedAttempts" integer,
    "BlockedAt" character varying(27),
    "FirstFailedAttemptAt" character varying(27)
);


ALTER TABLE public."VerifyApostilleIpLog" OWNER TO postgres;

--
-- TOC entry 213 (class 1259 OID 16402)
-- Name: VerifyApostilleUIDSeq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."VerifyApostilleUIDSeq"
    START WITH 211
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 999999999999999999
    CACHE 1;


ALTER TABLE public."VerifyApostilleUIDSeq" OWNER TO postgres;

--
-- TOC entry 3339 (class 0 OID 0)
-- Dependencies: 213
-- Name: VerifyApostilleUIDSeq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."VerifyApostilleUIDSeq" OWNED BY public."VerifyApostille"."UID";


--
-- TOC entry 3176 (class 2604 OID 16403)
-- Name: Verify-apostilles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Verify-apostilles" ALTER COLUMN id SET DEFAULT nextval('public."Verify-apostilles_id_seq"'::regclass);


--
-- TOC entry 3180 (class 2604 OID 16404)
-- Name: VerifyApostille UID; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."VerifyApostille" ALTER COLUMN "UID" SET DEFAULT nextval('public."VerifyApostilleUIDSeq"'::regclass);


--
-- TOC entry 3328 (class 0 OID 16385)
-- Dependencies: 209
-- Data for Name: Verify-apostilles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Verify-apostilles" (id, "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 3330 (class 0 OID 16389)
-- Dependencies: 211
-- Data for Name: VerifyApostille; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."VerifyApostille" ("UID", "ApostilleNumber", "DateIssued", "SignedBy", "ActingCapacityOf", "BearsStampSeal", "IssuedBy", "DateApostilleCreated", "DateApostilleUpdated", "DateInserted", "DateUpdated", id, "ApostilleType") FROM stdin;
1	APO-1	2016-07-11 08:47:34	A Le Page	A Le Page	Registrar of Births, Deaths and Marriages	Legalisation Four	2016-07-11 08:47:34	2016-07-11 08:47:34	2016-08-05 10:23:27.48311	2016-08-05 10:23:27.48311	\N	paper
\.


--
-- TOC entry 3331 (class 0 OID 16397)
-- Dependencies: 212
-- Data for Name: VerifyApostilleIpLog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."VerifyApostilleIpLog" ("Ip", "FailedAttempts", "BlockedAt", "FirstFailedAttemptAt") FROM stdin;
\.


--
-- TOC entry 3340 (class 0 OID 0)
-- Dependencies: 210
-- Name: Verify-apostilles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Verify-apostilles_id_seq"', 1, false);


--
-- TOC entry 3341 (class 0 OID 0)
-- Dependencies: 213
-- Name: VerifyApostilleUIDSeq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."VerifyApostilleUIDSeq"', 2752, true);


--
-- TOC entry 3184 (class 2606 OID 16406)
-- Name: VerifyApostille UID; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."VerifyApostille"
    ADD CONSTRAINT "UID" PRIMARY KEY ("UID");


--
-- TOC entry 3182 (class 2606 OID 16408)
-- Name: Verify-apostilles Verify-apostilles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Verify-apostilles"
    ADD CONSTRAINT "Verify-apostilles_pkey" PRIMARY KEY (id);


--
-- TOC entry 3188 (class 2606 OID 16410)
-- Name: VerifyApostilleIpLog VerifyApostilleIpLog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."VerifyApostilleIpLog"
    ADD CONSTRAINT "VerifyApostilleIpLog_pkey" PRIMARY KEY ("Ip");


--
-- TOC entry 3186 (class 2606 OID 16412)
-- Name: VerifyApostille VerifyApostille_ApostilleNumber_DateIssued_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."VerifyApostille"
    ADD CONSTRAINT "VerifyApostille_ApostilleNumber_DateIssued_key" UNIQUE ("ApostilleNumber", "DateIssued");


-- Completed on 2023-01-12 16:10:36 GMT

--
-- PostgreSQL database dump complete
--

