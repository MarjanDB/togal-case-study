CREATE DATABASE app;

\c app


-- public.stored_document definition

-- Drop table

-- DROP TABLE public.stored_document;

CREATE TABLE public.stored_document (
	id uuid NOT NULL,
	hash text NOT NULL,
	stored_at timestamptz NOT NULL,
	"data" bytea NOT NULL,
	original_file_name text NOT NULL,
	CONSTRAINT stored_document_pk PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.stored_document OWNER TO postgres;
GRANT ALL ON TABLE public.stored_document TO postgres;


-- public.virtual_document definition

-- Drop table

-- DROP TABLE public.virtual_document;

CREATE TABLE public.virtual_document (
	id uuid NOT NULL,
	"name" text NOT NULL,
	description text NULL,
	updated_at timestamptz NOT NULL,
	created_at timestamptz NOT NULL,
	deleted_at timestamptz NULL,
	"type" text NOT NULL,
	CONSTRAINT virtual_document_pk PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.virtual_document OWNER TO postgres;
GRANT ALL ON TABLE public.virtual_document TO postgres;


-- public.virtual_folder definition

-- Drop table

-- DROP TABLE public.virtual_folder;

CREATE TABLE public.virtual_folder (
	id uuid NOT NULL,
	"name" text NOT NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	deleted_at timestamptz NULL,
	CONSTRAINT virtual_folder_pk PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.virtual_folder OWNER TO postgres;
GRANT ALL ON TABLE public.virtual_folder TO postgres;


-- public.virtual_document_stored_documents definition

-- Drop table

-- DROP TABLE public.virtual_document_stored_documents;

CREATE TABLE public.virtual_document_stored_documents (
	stored_document uuid NOT NULL,
	virtual_document uuid NOT NULL,
	CONSTRAINT virtual_document_stored_documents_pk PRIMARY KEY (stored_document, virtual_document),
	CONSTRAINT virtual_document_stored_documents_stored_document_fk FOREIGN KEY (stored_document) REFERENCES public.stored_document(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT virtual_document_stored_documents_virtual_document_fk FOREIGN KEY (virtual_document) REFERENCES public.virtual_document(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Permissions

ALTER TABLE public.virtual_document_stored_documents OWNER TO postgres;
GRANT ALL ON TABLE public.virtual_document_stored_documents TO postgres;


-- public.virtual_folder_virtual_documents definition

-- Drop table

-- DROP TABLE public.virtual_folder_virtual_documents;

CREATE TABLE public.virtual_folder_virtual_documents (
	virtual_folder uuid NOT NULL,
	virtual_document uuid NOT NULL,
	CONSTRAINT virtual_folder_virtual_documents_pk PRIMARY KEY (virtual_folder, virtual_document),
	CONSTRAINT virtual_folder_virtual_documents_virtual_document_fk FOREIGN KEY (virtual_document) REFERENCES public.virtual_document(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT virtual_folder_virtual_documents_virtual_folder_fk FOREIGN KEY (virtual_folder) REFERENCES public.virtual_folder(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Permissions

ALTER TABLE public.virtual_folder_virtual_documents OWNER TO postgres;
GRANT ALL ON TABLE public.virtual_folder_virtual_documents TO postgres;




-- Permissions

GRANT ALL ON SCHEMA public TO pg_database_owner;
GRANT USAGE ON SCHEMA public TO public;