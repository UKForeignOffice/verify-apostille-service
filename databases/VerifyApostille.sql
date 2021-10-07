--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.21
-- Dumped by pg_dump version 13.3

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

--
-- Name: Verify-apostilles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Verify-apostilles" (
    id integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Verify-apostilles" OWNER TO postgres;

--
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
-- Name: Verify-apostilles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Verify-apostilles_id_seq" OWNED BY public."Verify-apostilles".id;


--
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
    "DateApostilleUpdated" timestamp without time zone,
    "DateInserted" timestamp without time zone DEFAULT now() NOT NULL,
    "DateUpdated" timestamp without time zone DEFAULT now() NOT NULL,
    id numeric
);


ALTER TABLE public."VerifyApostille" OWNER TO postgres;

--
-- Name: VerifyApostilleUIDSeq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."VerifyApostilleUIDSeq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."VerifyApostilleUIDSeq" OWNER TO postgres;

--
-- Name: VerifyApostilleUIDSeq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."VerifyApostilleUIDSeq" OWNED BY public."VerifyApostille"."UID";


--
-- Name: archive; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.archive (
    "UID" integer NOT NULL,
    "createdAt" bigint,
    "fromModel" text,
    "originalRecord" json,
    "originalRecordId" json
);


ALTER TABLE public.archive OWNER TO postgres;

--
-- Name: Verify-apostilles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Verify-apostilles" ALTER COLUMN id SET DEFAULT nextval('public."Verify-apostilles_id_seq"'::regclass);


--
-- Name: VerifyApostille UID; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."VerifyApostille" ALTER COLUMN "UID" SET DEFAULT nextval('public."VerifyApostilleUIDSeq"'::regclass);


--
-- Data for Name: Verify-apostilles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Verify-apostilles" (id, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: VerifyApostille; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."VerifyApostille" ("UID", "ApostilleNumber", "DateIssued", "SignedBy", "ActingCapacityOf", "BearsStampSeal", "IssuedBy", "DateApostilleCreated", "DateApostilleUpdated", "DateInserted", "DateUpdated", id) FROM stdin;
1	APO-1	2016-11-07 08:47:00	A Le Page	Registrar of Births Deaths and Marriages	Legalisation Four	\N	2016-11-07 08:47:00	2016-11-07 08:47:00	2016-11-07 08:47:00	2016-11-07 08:47:00	\N
\.


--
-- Data for Name: archive; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.archive ("UID", "createdAt", "fromModel", "originalRecord", "originalRecordId") FROM stdin;
\.


--
-- Name: Verify-apostilles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Verify-apostilles_id_seq"', 1, false);


--
-- Name: VerifyApostilleUIDSeq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."VerifyApostilleUIDSeq"', 3824412, true);


--
-- Name: VerifyApostille UID; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."VerifyApostille"
    ADD CONSTRAINT "UID" PRIMARY KEY ("UID");


--
-- Name: Verify-apostilles Verify-apostilles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Verify-apostilles"
    ADD CONSTRAINT "Verify-apostilles_pkey" PRIMARY KEY (id);


--
-- Name: VerifyApostille VerifyApostille_ApostilleNumber_DateIssued_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."VerifyApostille"
    ADD CONSTRAINT "VerifyApostille_ApostilleNumber_DateIssued_key" UNIQUE ("ApostilleNumber", "DateIssued");


--
-- Name: archive archive_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.archive
    ADD CONSTRAINT archive_pkey PRIMARY KEY ("UID");


--
-- PostgreSQL database dump complete
--

VerifyApostille
.sql
