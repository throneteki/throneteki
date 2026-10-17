--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: pgmigrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pgmigrations (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    run_on timestamp without time zone NOT NULL
);

--
-- Name: pgmigrations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.pgmigrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: pgmigrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.pgmigrations_id_seq OWNED BY public.pgmigrations.id;

--
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.refresh_tokens (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    token_id text NOT NULL,
    token text NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    ip inet,
    last_used_at timestamp with time zone DEFAULT now() NOT NULL
);

--
-- Name: COLUMN refresh_tokens.token_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.refresh_tokens.token_id IS 'Part of the HMAC input for token, and the id clients hold. Tokens from MongoDB keep their ObjectId here so existing sessions stay valid';

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.refresh_tokens ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

--
-- Name: user_blocks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_blocks (
    user_id bigint NOT NULL,
    blocked_username text NOT NULL,
    CONSTRAINT user_blocks_blocked_username_check CHECK ((blocked_username = lower(blocked_username)))
);

--
-- Name: COLUMN user_blocks.blocked_username; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.user_blocks.blocked_username IS 'Blocks are by lower cased username, matching how the lobby compares them';

--
-- Name: user_permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_permissions (
    user_id bigint NOT NULL,
    permission text NOT NULL,
    CONSTRAINT user_permissions_permission_check CHECK ((permission = ANY (ARRAY['isAdmin'::text, 'isContributor'::text, 'isSupporter'::text, 'canEditNews'::text, 'canManageUsers'::text, 'canManagePermissions'::text, 'canManageGames'::text, 'canManageNodes'::text, 'canModerateChat'::text, 'canManageMotd'::text, 'canManageEvents'::text, 'canManageBanlist'::text])))
);

--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    mongo_id text,
    username text NOT NULL,
    email text NOT NULL,
    email_domain text,
    password text NOT NULL,
    registered_at timestamp with time zone DEFAULT now() NOT NULL,
    verified boolean DEFAULT false NOT NULL,
    disabled boolean DEFAULT false NOT NULL,
    enable_gravatar boolean DEFAULT false NOT NULL,
    settings jsonb DEFAULT '{}'::jsonb NOT NULL,
    prompted_action_windows jsonb DEFAULT '{}'::jsonb NOT NULL,
    patreon jsonb,
    activation_token_hash text,
    activation_token_expires_at timestamp with time zone,
    activation_token_issued_at timestamp with time zone,
    reset_token_hash text,
    reset_token_expires_at timestamp with time zone,
    reset_token_issued_at timestamp with time zone,
    register_ip inet,
    register_ip_normalized inet,
    register_subnet cidr,
    last_login_ip inet,
    last_login_subnet cidr,
    signup_fingerprint_hash text,
    risk_score integer DEFAULT 0 NOT NULL,
    risk_flags text[] DEFAULT '{}'::text[] NOT NULL,
    trust_state text DEFAULT 'trusted'::text NOT NULL,
    restricted_until timestamp with time zone,
    evasion_review_required boolean DEFAULT false NOT NULL,
    ban_reason text,
    mod_notes text,
    legacy jsonb,
    CONSTRAINT users_email_check CHECK ((email <> ''::text)),
    CONSTRAINT users_trust_state_check CHECK ((trust_state = ANY (ARRAY['trusted'::text, 'restricted'::text, 'banned_evasion_review'::text]))),
    CONSTRAINT users_username_check CHECK ((username <> ''::text))
);

--
-- Name: COLUMN users.mongo_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.mongo_id IS 'The ObjectId this user had in MongoDB, so old links and references still resolve';

--
-- Name: COLUMN users.legacy; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.legacy IS 'Fields from the MongoDB document that have no column, kept until the migration is complete';

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.users ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

--
-- Name: pgmigrations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pgmigrations ALTER COLUMN id SET DEFAULT nextval('public.pgmigrations_id_seq'::regclass);

--
-- Name: pgmigrations pgmigrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pgmigrations
    ADD CONSTRAINT pgmigrations_pkey PRIMARY KEY (id);

--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);

--
-- Name: refresh_tokens refresh_tokens_token_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_id_key UNIQUE (token_id);

--
-- Name: user_blocks user_blocks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_blocks
    ADD CONSTRAINT user_blocks_pkey PRIMARY KEY (user_id, blocked_username);

--
-- Name: user_permissions user_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_permissions
    ADD CONSTRAINT user_permissions_pkey PRIMARY KEY (user_id, permission);

--
-- Name: users users_mongo_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_mongo_id_key UNIQUE (mongo_id);

--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);

--
-- Name: refresh_tokens_ip_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX refresh_tokens_ip_idx ON public.refresh_tokens USING btree (ip);

--
-- Name: refresh_tokens_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX refresh_tokens_user_id_idx ON public.refresh_tokens USING btree (user_id);

--
-- Name: user_permissions_permission_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_permissions_permission_idx ON public.user_permissions USING btree (permission);

--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (lower(email));

--
-- Name: users_last_login_ip_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_last_login_ip_idx ON public.users USING btree (last_login_ip);

--
-- Name: users_last_login_subnet_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_last_login_subnet_idx ON public.users USING btree (last_login_subnet);

--
-- Name: users_register_ip_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_register_ip_idx ON public.users USING btree (register_ip);

--
-- Name: users_register_ip_normalized_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_register_ip_normalized_idx ON public.users USING btree (register_ip_normalized);

--
-- Name: users_register_subnet_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_register_subnet_idx ON public.users USING btree (register_subnet);

--
-- Name: users_signup_fingerprint_hash_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_signup_fingerprint_hash_idx ON public.users USING btree (signup_fingerprint_hash);

--
-- Name: users_unverified_activation_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_unverified_activation_idx ON public.users USING btree (activation_token_expires_at) WHERE (NOT verified);

--
-- Name: users_username_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_username_key ON public.users USING btree (lower(username));

--
-- Name: refresh_tokens refresh_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

--
-- Name: user_blocks user_blocks_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_blocks
    ADD CONSTRAINT user_blocks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

--
-- Name: user_permissions user_permissions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_permissions
    ADD CONSTRAINT user_permissions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

--
-- PostgreSQL database dump complete
--
