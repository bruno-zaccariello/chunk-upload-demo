CREATE SCHEMA myschema
    AUTHORIZATION myuser;

CREATE TABLE IF NOT EXISTS myschema.tfile
(
    "id" SERIAL,
    "file_name" character varying(60) COLLATE pg_catalog."default" NOT NULL,
    "file_hash" character varying(40) COLLATE pg_catalog."default",
    "total_chunks" integer NOT NULL,
    "file_size" integer NOT NULL,
    "last_processed_chunk" integer,
    "status" character varying(20) COLLATE pg_catalog."default",
    CONSTRAINT "TFILE_pkey" PRIMARY KEY ("id")
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS myschema.tfile
    OWNER to myuser;