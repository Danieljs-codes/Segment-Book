create table
  public.users (
    id uuid not null default gen_random_uuid (),
    "authUserId" text not null,
    name text not null,
    email text not null,
    "createdAt" timestamp with time zone not null default (now() at time zone 'utc'::text),
    username text not null,
    constraint users_pkey primary key (id)
  ) tablespace pg_default;

create unique index if not exists "users_authUserId_key" on public.users using btree ("authUserId") tablespace pg_default;

create unique index if not exists users_email_key on public.users using btree (email) tablespace pg_default;

create table
  public.notifications (
    id uuid not null default gen_random_uuid (),
    "senderId" uuid not null,
    "receiverId" uuid not null,
    title text not null,
    content text not null,
    "isRead" boolean not null default false,
    "createdAt" timestamp with time zone not null default (now() at time zone 'utc'::text),
    "updatedAt" timestamp with time zone not null default (now() at time zone 'utc'::text),
    constraint notifications_pkey primary key (id),
    constraint notifications_receiverid_fkey foreign key ("receiverId") references users (id) on update cascade on delete restrict,
    constraint notifications_senderid_fkey foreign key ("senderId") references users (id) on update cascade on delete restrict
  ) tablespace pg_default;

  create table
  public.messages (
    id uuid not null default gen_random_uuid (),
    content text not null,
    "senderId" uuid not null,
    "createdAt" timestamp without time zone not null default current_timestamp,
    chat_id uuid null,
    constraint messages_pkey primary key (id),
    constraint messages_chat_id_fkey foreign key (chat_id) references chats (id),
    constraint messages_senderId_fkey foreign key ("senderId") references users (id) on update cascade on delete restrict
  ) tablespace pg_default;

create index if not exists messages_chat_id_idx on public.messages using btree (chat_id) tablespace pg_default;

create index if not exists messages_sender_id_idx on public.messages using btree ("senderId") tablespace pg_default;

create table
  public.donation_requests (
    id uuid not null default gen_random_uuid (),
    "bookId" uuid not null,
    "requesterId" uuid not null,
    "donorId" uuid not null,
    status public.RequestStatus not null default 'PENDING'::"RequestStatus",
    "createdAt" timestamp without time zone not null default current_timestamp,
    "updatedAt" timestamp without time zone not null,
    constraint donation_requests_pkey primary key (id),
    constraint donation_requests_bookId_fkey foreign key ("bookId") references books (id) on update cascade on delete restrict,
    constraint donation_requests_donorId_fkey foreign key ("donorId") references users (id) on update cascade on delete restrict,
    constraint donation_requests_requesterId_fkey foreign key ("requesterId") references users (id) on update cascade on delete restrict
  ) tablespace pg_default;

  create table
  public.donation_requests (
    id uuid not null default gen_random_uuid (),
    "bookId" uuid not null,
    "requesterId" uuid not null,
    "donorId" uuid not null,
    status public.RequestStatus not null default 'PENDING'::"RequestStatus",
    "createdAt" timestamp without time zone not null default current_timestamp,
    "updatedAt" timestamp without time zone not null,
    constraint donation_requests_pkey primary key (id),
    constraint donation_requests_bookId_fkey foreign key ("bookId") references books (id) on update cascade on delete restrict,
    constraint donation_requests_donorId_fkey foreign key ("donorId") references users (id) on update cascade on delete restrict,
    constraint donation_requests_requesterId_fkey foreign key ("requesterId") references users (id) on update cascade on delete restrict
  ) tablespace pg_default;

  create table
  public.chats (
    id uuid not null default extensions.uuid_generate_v4 (),
    donation_request_id uuid null,
    created_at timestamp with time zone null default now(),
    constraint chats_pkey primary key (id),
    constraint chats_donation_request_id_fkey foreign key (donation_request_id) references donation_requests (id)
  ) tablespace pg_default;

create index if not exists chats_donation_request_id_idx on public.chats using btree (donation_request_id) tablespace pg_default;

  create table
  public.categories (
    id uuid not null default gen_random_uuid (),
    name text not null,
    constraint categories_pkey primary key (id),
    constraint categories_name_unique unique (name)
  ) tablespace pg_default;

  create table
  public.books (
    id uuid not null default gen_random_uuid (),
    title text not null,
    author text not null,
    description text null,
    "ownerId" uuid not null,
    "isDonated" boolean not null default false,
    "createdAt" timestamp with time zone not null default (now() at time zone 'utc'::text),
    condition text not null,
    language text not null,
    "donatedToId" uuid null,
    "updatedAt" timestamp with time zone not null default (now() at time zone 'utc'::text),
    constraint books_pkey primary key (id),
    constraint books_donatedtoid_fkey foreign key ("donatedToId") references users (id) on update cascade on delete set null,
    constraint books_ownerId_fkey foreign key ("ownerId") references users (id) on update cascade on delete restrict,
    constraint condition_check check (
      (
        condition = any (
          array[
            'like new'::text,
            'excellent'::text,
            'fair'::text,
            'good'::text,
            'acceptable'::text
          ]
        )
      )
    ),
    constraint language_check check (
      (
        language = any (
          array[
            'english'::text,
            'spanish'::text,
            'french'::text,
            'german'::text,
            'other'::text
          ]
        )
      )
    )
  ) tablespace pg_default;

  create table
  public.book_categories (
    book_id uuid not null,
    category_id uuid not null,
    constraint book_categories_pkey primary key (book_id, category_id),
    constraint book_categories_book_fkey foreign key (book_id) references books (id) on delete cascade,
    constraint book_categories_category_fkey foreign key (category_id) references categories (id) on delete cascade
  ) tablespace pg_default;