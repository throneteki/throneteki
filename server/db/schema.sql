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
-- Name: abuse_blocks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.abuse_blocks (
    id bigint NOT NULL,
    mongo_id text,
    scope text NOT NULL,
    value text NOT NULL,
    reason text,
    source_user_id bigint,
    created_by text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone,
    active boolean DEFAULT true NOT NULL,
    deactivated_at timestamp with time zone,
    CONSTRAINT abuse_blocks_scope_check CHECK ((scope = ANY (ARRAY['ip'::text, 'subnet'::text, 'fingerprint'::text, 'email_domain'::text])))
);

--
-- Name: abuse_blocks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.abuse_blocks ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.abuse_blocks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

--
-- Name: abuse_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.abuse_events (
    id bigint NOT NULL,
    mongo_id text,
    type text NOT NULL,
    username text,
    user_id bigint,
    ip inet,
    subnet cidr,
    fingerprint_hash text,
    email_domain text,
    outcome text DEFAULT 'allowed'::text NOT NULL,
    signals text[] DEFAULT '{}'::text[] NOT NULL,
    score_delta integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by text
);

--
-- Name: abuse_events_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.abuse_events ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.abuse_events_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

--
-- Name: banlist; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.banlist (
    id bigint NOT NULL,
    mongo_id text,
    ip text NOT NULL,
    created_by text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

--
-- Name: banlist_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.banlist ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.banlist_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

--
-- Name: cards; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cards (
    code text NOT NULL,
    data jsonb NOT NULL
);

--
-- Name: deck_cards; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.deck_cards (
    deck_id bigint NOT NULL,
    section text NOT NULL,
    "position" integer NOT NULL,
    card_code text NOT NULL,
    count integer DEFAULT 1 NOT NULL,
    CONSTRAINT deck_cards_count_check CHECK ((count > 0)),
    CONSTRAINT deck_cards_section_check CHECK ((section = ANY (ARRAY['plot'::text, 'draw'::text, 'banner'::text, 'pool'::text])))
);

--
-- Name: decks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.decks (
    id bigint NOT NULL,
    mongo_id text,
    user_id bigint,
    standalone_deck_id text,
    name text NOT NULL,
    format text,
    variant text,
    faction_code text NOT NULL,
    agenda_code text,
    event_id bigint,
    is_favourite boolean DEFAULT false NOT NULL,
    last_updated timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT decks_check CHECK (((user_id IS NULL) <> (standalone_deck_id IS NULL)))
);

--
-- Name: decks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.decks ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.decks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

--
-- Name: draft_cubes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.draft_cubes (
    id bigint NOT NULL,
    mongo_id text,
    name text NOT NULL,
    pack_definitions jsonb DEFAULT '[]'::jsonb NOT NULL,
    starter_deck jsonb,
    last_updated timestamp with time zone DEFAULT now() NOT NULL
);

--
-- Name: draft_cubes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.draft_cubes ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.draft_cubes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

--
-- Name: events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.events (
    id bigint NOT NULL,
    mongo_id text,
    name text NOT NULL,
    format text,
    variant text,
    legality jsonb,
    custom_legality jsonb,
    game_type text,
    lock_decks boolean DEFAULT false NOT NULL,
    use_event_game_options boolean DEFAULT false NOT NULL,
    event_game_options jsonb,
    valid_table_creators text[],
    valid_spectators text[],
    legacy jsonb
);

--
-- Name: events_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.events ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.events_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

--
-- Name: game_players; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.game_players (
    game_id bigint NOT NULL,
    "position" integer NOT NULL,
    name text NOT NULL,
    user_id bigint,
    faction text,
    agendas text[] DEFAULT '{}'::text[] NOT NULL,
    power integer,
    eliminated boolean DEFAULT false NOT NULL,
    details jsonb DEFAULT '{}'::jsonb NOT NULL,
    stats jsonb
);

--
-- Name: games; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.games (
    id bigint NOT NULL,
    mongo_id text,
    game_id text,
    event_name text,
    started_at timestamp with time zone,
    finished_at timestamp with time zone,
    winners text[] DEFAULT '{}'::text[] NOT NULL,
    win_reason text,
    game_type text,
    legacy jsonb
);

--
-- Name: games_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.games ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.games_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

--
-- Name: messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.messages (
    id bigint NOT NULL,
    mongo_id text,
    user_id bigint,
    poster jsonb NOT NULL,
    message text,
    posted_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted boolean DEFAULT false NOT NULL,
    deleted_by text
);

--
-- Name: messages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.messages ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.messages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

--
-- Name: motd; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.motd (
    id boolean DEFAULT true NOT NULL,
    poster jsonb,
    message text,
    motd_type text,
    posted_at timestamp with time zone,
    CONSTRAINT motd_id_check CHECK (id)
);

--
-- Name: news; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.news (
    id bigint NOT NULL,
    mongo_id text,
    poster text,
    text text NOT NULL,
    published_at timestamp with time zone DEFAULT now() NOT NULL
);

--
-- Name: news_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.news ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.news_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

--
-- Name: packs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.packs (
    code text NOT NULL,
    data jsonb NOT NULL
);

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
    email text,
    email_domain text,
    password text,
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
    CONSTRAINT users_trust_state_check CHECK ((trust_state = ANY (ARRAY['trusted'::text, 'new'::text, 'restricted'::text, 'banned_evasion_review'::text]))),
    CONSTRAINT users_username_check CHECK ((username <> ''::text))
);

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
-- Name: abuse_blocks abuse_blocks_mongo_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.abuse_blocks
    ADD CONSTRAINT abuse_blocks_mongo_id_key UNIQUE (mongo_id);

--
-- Name: abuse_blocks abuse_blocks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.abuse_blocks
    ADD CONSTRAINT abuse_blocks_pkey PRIMARY KEY (id);

--
-- Name: abuse_events abuse_events_mongo_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.abuse_events
    ADD CONSTRAINT abuse_events_mongo_id_key UNIQUE (mongo_id);

--
-- Name: abuse_events abuse_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.abuse_events
    ADD CONSTRAINT abuse_events_pkey PRIMARY KEY (id);

--
-- Name: banlist banlist_ip_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.banlist
    ADD CONSTRAINT banlist_ip_key UNIQUE (ip);

--
-- Name: banlist banlist_mongo_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.banlist
    ADD CONSTRAINT banlist_mongo_id_key UNIQUE (mongo_id);

--
-- Name: banlist banlist_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.banlist
    ADD CONSTRAINT banlist_pkey PRIMARY KEY (id);

--
-- Name: cards cards_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cards
    ADD CONSTRAINT cards_pkey PRIMARY KEY (code);

--
-- Name: deck_cards deck_cards_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deck_cards
    ADD CONSTRAINT deck_cards_pkey PRIMARY KEY (deck_id, section, "position");

--
-- Name: decks decks_mongo_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.decks
    ADD CONSTRAINT decks_mongo_id_key UNIQUE (mongo_id);

--
-- Name: decks decks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.decks
    ADD CONSTRAINT decks_pkey PRIMARY KEY (id);

--
-- Name: decks decks_standalone_deck_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.decks
    ADD CONSTRAINT decks_standalone_deck_id_key UNIQUE (standalone_deck_id);

--
-- Name: draft_cubes draft_cubes_mongo_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.draft_cubes
    ADD CONSTRAINT draft_cubes_mongo_id_key UNIQUE (mongo_id);

--
-- Name: draft_cubes draft_cubes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.draft_cubes
    ADD CONSTRAINT draft_cubes_pkey PRIMARY KEY (id);

--
-- Name: events events_mongo_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_mongo_id_key UNIQUE (mongo_id);

--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);

--
-- Name: game_players game_players_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.game_players
    ADD CONSTRAINT game_players_pkey PRIMARY KEY (game_id, "position");

--
-- Name: games games_game_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.games
    ADD CONSTRAINT games_game_id_key UNIQUE (game_id);

--
-- Name: games games_mongo_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.games
    ADD CONSTRAINT games_mongo_id_key UNIQUE (mongo_id);

--
-- Name: games games_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.games
    ADD CONSTRAINT games_pkey PRIMARY KEY (id);

--
-- Name: messages messages_mongo_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_mongo_id_key UNIQUE (mongo_id);

--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);

--
-- Name: motd motd_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.motd
    ADD CONSTRAINT motd_pkey PRIMARY KEY (id);

--
-- Name: news news_mongo_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_mongo_id_key UNIQUE (mongo_id);

--
-- Name: news news_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_pkey PRIMARY KEY (id);

--
-- Name: packs packs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.packs
    ADD CONSTRAINT packs_pkey PRIMARY KEY (code);

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
-- Name: abuse_blocks_scope_value_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX abuse_blocks_scope_value_idx ON public.abuse_blocks USING btree (scope, value) WHERE active;

--
-- Name: abuse_events_type_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX abuse_events_type_created_at_idx ON public.abuse_events USING btree (type, created_at);

--
-- Name: abuse_events_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX abuse_events_user_id_idx ON public.abuse_events USING btree (user_id);

--
-- Name: abuse_events_username_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX abuse_events_username_idx ON public.abuse_events USING btree (username);

--
-- Name: decks_event_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX decks_event_id_idx ON public.decks USING btree (event_id);

--
-- Name: decks_user_id_event_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX decks_user_id_event_id_key ON public.decks USING btree (user_id, event_id) WHERE (event_id IS NOT NULL);

--
-- Name: decks_user_id_last_updated_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX decks_user_id_last_updated_idx ON public.decks USING btree (user_id, last_updated DESC);

--
-- Name: game_players_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX game_players_user_id_idx ON public.game_players USING btree (user_id);

--
-- Name: games_started_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX games_started_at_idx ON public.games USING btree (started_at);

--
-- Name: messages_posted_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX messages_posted_at_idx ON public.messages USING btree (posted_at DESC);

--
-- Name: news_published_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX news_published_at_idx ON public.news USING btree (published_at DESC);

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
-- Name: abuse_blocks abuse_blocks_source_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.abuse_blocks
    ADD CONSTRAINT abuse_blocks_source_user_id_fkey FOREIGN KEY (source_user_id) REFERENCES public.users(id) ON DELETE SET NULL;

--
-- Name: abuse_events abuse_events_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.abuse_events
    ADD CONSTRAINT abuse_events_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;

--
-- Name: deck_cards deck_cards_deck_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deck_cards
    ADD CONSTRAINT deck_cards_deck_id_fkey FOREIGN KEY (deck_id) REFERENCES public.decks(id) ON DELETE CASCADE;

--
-- Name: decks decks_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.decks
    ADD CONSTRAINT decks_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE SET NULL;

--
-- Name: decks decks_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.decks
    ADD CONSTRAINT decks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

--
-- Name: game_players game_players_game_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.game_players
    ADD CONSTRAINT game_players_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.games(id) ON DELETE CASCADE;

--
-- Name: game_players game_players_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.game_players
    ADD CONSTRAINT game_players_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;

--
-- Name: messages messages_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;

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
