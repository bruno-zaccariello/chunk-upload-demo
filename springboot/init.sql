CREATE SCHEMA "MYSCHEMA"
    AUTHORIZATION myuser;

CREATE TABLE IF NOT EXISTS "MYSCHEMA"."TFILE"
(
    "ID" SERIAL,
    "FILE_NAME" character varying(60) COLLATE pg_catalog."default" NOT NULL,
    "FILE_HASH" character varying(40) COLLATE pg_catalog."default",
    "TOTAL_CHUNKS" integer NOT NULL,
    "LAST_PROCESSED_CHUNK" integer,
    "STATUS" character varying(20) COLLATE pg_catalog."default",
    CONSTRAINT "TFILE_pkey" PRIMARY KEY ("ID")
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS "MYSCHEMA"."TFILE"
    OWNER to myuser;