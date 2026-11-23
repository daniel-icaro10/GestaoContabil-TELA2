-- Schema do HUBContábil. Idempotente: roda a cada inicialização do servidor sem apagar dados.

CREATE TABLE IF NOT EXISTS escritorios (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome        text NOT NULL,
  cnpj        text UNIQUE,
  plano       text NOT NULL DEFAULT 'Essencial' CHECK (plano IN ('Essencial', 'Profissional', 'Premium')),
  status      text NOT NULL DEFAULT 'Ativo' CHECK (status IN ('Ativo', 'Teste', 'Suspenso')),
  criado_em   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS usuarios (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome           text NOT NULL,
  email          text NOT NULL,
  senha_hash     text NOT NULL,                -- bcrypt; a senha nunca é gravada
  perfil         text NOT NULL CHECK (perfil IN ('admin', 'escritorio', 'pj', 'pf')),
  escritorio_id  uuid REFERENCES escritorios (id) ON DELETE RESTRICT,
  ativo          boolean NOT NULL DEFAULT true,
  criado_em      timestamptz NOT NULL DEFAULT now(),
  atualizado_em  timestamptz NOT NULL DEFAULT now(),
  ultimo_acesso  timestamptz
);

CREATE UNIQUE INDEX IF NOT EXISTS usuarios_email_uk ON usuarios (lower(email));
