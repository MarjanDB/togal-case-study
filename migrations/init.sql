CREATE DATABASE app;

\c app


-- public.stored_documents definition

-- Drop table

-- DROP TABLE public.stored_documents;

CREATE TABLE public.stored_documents (
	id uuid NOT NULL,
	hash text NOT NULL,
	stored_at timestamptz NOT NULL,
	"data" bytea NOT NULL,
	original_file_name text NOT NULL,
	CONSTRAINT stored_documents_pk PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.stored_documents OWNER TO postgres;
GRANT ALL ON TABLE public.stored_documents TO postgres;


-- public.virtual_documents definition

-- Drop table

-- DROP TABLE public.virtual_documents;

CREATE TABLE public.virtual_documents (
	id uuid NOT NULL,
	"name" text NOT NULL,
	description text NULL,
	updated_at timestamptz NOT NULL,
	created_at timestamptz NOT NULL,
	deleted_at timestamptz NULL,
	"type" text NOT NULL,
	CONSTRAINT virtual_documents_pk PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.virtual_documents OWNER TO postgres;
GRANT ALL ON TABLE public.virtual_documents TO postgres;


-- public.virtual_folders definition

-- Drop table

-- DROP TABLE public.virtual_folders;

CREATE TABLE public.virtual_folders (
	id uuid NOT NULL,
	"name" text NOT NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	deleted_at timestamptz NULL,
	CONSTRAINT virtual_folders_pk PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.virtual_folders OWNER TO postgres;
GRANT ALL ON TABLE public.virtual_folders TO postgres;


-- public.virtual_documents_stored_documents definition

-- Drop table

-- DROP TABLE public.virtual_documents_stored_documents;

CREATE TABLE public.virtual_documents_stored_documents (
	stored_document_id uuid NOT NULL,
	virtual_document_id uuid NOT NULL,
	CONSTRAINT virtual_documents_stored_documents_pk PRIMARY KEY (stored_document_id, virtual_document_id),
	CONSTRAINT virtual_documents_stored_documents_stored_document_id_fk FOREIGN KEY (stored_document_id) REFERENCES public.stored_documents(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT virtual_documents_stored_documents_virtual_document_id_fk FOREIGN KEY (virtual_document_id) REFERENCES public.virtual_documents(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Permissions

ALTER TABLE public.virtual_documents_stored_documents OWNER TO postgres;
GRANT ALL ON TABLE public.virtual_documents_stored_documents TO postgres;


-- public.virtual_folders_virtual_documents definition

-- Drop table

-- DROP TABLE public.virtual_folders_virtual_documents;

CREATE TABLE public.virtual_folders_virtual_documents (
	virtual_folder_id uuid NOT NULL,
	virtual_document_id uuid NOT NULL,
	CONSTRAINT virtual_folders_virtual_documents_pk PRIMARY KEY (virtual_folder_id, virtual_document_id),
	CONSTRAINT virtual_folders_virtual_documents_virtual_document_id_fk FOREIGN KEY (virtual_document_id) REFERENCES public.virtual_documents(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT virtual_folders_virtual_documents_virtual_folder_id_fk FOREIGN KEY (virtual_folder_id) REFERENCES public.virtual_folders(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Permissions

ALTER TABLE public.virtual_folders_virtual_documents OWNER TO postgres;
GRANT ALL ON TABLE public.virtual_folders_virtual_documents TO postgres;




-- Permissions

GRANT ALL ON SCHEMA public TO pg_database_owner;
GRANT USAGE ON SCHEMA public TO public;