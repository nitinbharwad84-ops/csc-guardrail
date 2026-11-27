-- ============================================================
-- CSC Guardrail — PostgreSQL Schema
-- "Client Scope & Change Guardrail"
--
-- VastraKart Demo Seed Values:
--   Agency  : PixelCraft Studio
--   Client  : VastraKart
--   Budget  : ₹1,50,000 (budget_cap_inr = 150000)
--   Hours   : 120 hrs   (total_hours    = 120)
--   Rate    : ₹1,250/hr
--
-- Apply to Supabase:
--   supabase db push  (or paste in Supabase SQL Editor)
-- ============================================================

-- Enable UUID generation (available by default in Supabase/Postgres 14+)
-- If running on a vanilla Postgres instance, uncomment the next line:
-- CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ─────────────────────────────────────────────
-- 1. Projects (Fixed Contract Baseline)
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS projects (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_name     TEXT        NOT NULL DEFAULT 'PixelCraft Studio',
  client_name     TEXT        NOT NULL,
  title           TEXT        NOT NULL,
  budget_cap_inr  NUMERIC     NOT NULL CHECK (budget_cap_inr > 0),
  total_hours     INTEGER     NOT NULL CHECK (total_hours > 0),
  status          TEXT        NOT NULL DEFAULT 'active'
                              CHECK (status IN ('scanning', 'active', 'completed')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE  projects                IS 'Top-level fixed-price contracts between agency and client.';
COMMENT ON COLUMN projects.budget_cap_inr IS 'Fixed rupee ceiling, e.g. 150000 for ₹1,50,000.';
COMMENT ON COLUMN projects.total_hours    IS 'Total contracted hours, e.g. 120.';
COMMENT ON COLUMN projects.status        IS 'scanning | active | completed';

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policy: Agency members can read & write their own projects
CREATE POLICY "Agency members can manage their projects"
  ON projects
  FOR ALL
  USING (true)   -- Replace with: auth.uid() = agency_user_id once auth is wired
  WITH CHECK (true);


-- ─────────────────────────────────────────────
-- 2. SOW Ambiguities (Layer 1 — Pre-Kickoff Scanner)
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS sow_ambiguities (
  id                      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id              UUID        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  clause_title            TEXT        NOT NULL,         -- e.g. 'User Login & Account'
  vague_excerpt           TEXT        NOT NULL,         -- e.g. 'Standard login system for customers'
  missing_details         TEXT        NOT NULL,         -- e.g. 'Auth method unspecified (Email vs Google OAuth vs WhatsApp 2FA)'
  clarification_question  TEXT        NOT NULL,         -- e.g. 'Should Phase 1 include Email/Password only or also OAuth?'
  resolved_spec           TEXT,                         -- Filled once client/agency locks spec
  status                  TEXT        NOT NULL DEFAULT 'open'
                                      CHECK (status IN ('open', 'clarified')),
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sow_ambiguities_project_id_idx
  ON sow_ambiguities (project_id);

CREATE INDEX IF NOT EXISTS sow_ambiguities_status_idx
  ON sow_ambiguities (status);

COMMENT ON TABLE  sow_ambiguities              IS 'Vague / incomplete SOW clauses flagged by Layer 1 scanner before kickoff.';
COMMENT ON COLUMN sow_ambiguities.resolved_spec IS 'The clarified, locked specification text. NULL until status = clarified.';

ALTER TABLE sow_ambiguities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agency members can manage SOW ambiguities"
  ON sow_ambiguities
  FOR ALL
  USING (true)
  WITH CHECK (true);


-- ─────────────────────────────────────────────
-- 3. Scope Items (SOW Deliverables Baseline)
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS scope_items (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id   UUID        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title        TEXT        NOT NULL,
  hours        INTEGER     NOT NULL CHECK (hours > 0),
  status       TEXT        NOT NULL DEFAULT 'not_started'
                           CHECK (status IN ('completed', 'in_progress', 'not_started', 'deferred_phase_2')),
  is_swappable BOOLEAN     NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS scope_items_project_id_idx
  ON scope_items (project_id);

CREATE INDEX IF NOT EXISTS scope_items_swappable_idx
  ON scope_items (project_id, is_swappable) WHERE is_swappable = true;

COMMENT ON TABLE  scope_items             IS 'Individual SOW deliverables. Swappable items can be deferred to absorb client drift.';
COMMENT ON COLUMN scope_items.is_swappable IS 'True if this item can be deferred to Phase 2 to absorb incoming drift hours.';

ALTER TABLE scope_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agency members can manage scope items"
  ON scope_items
  FOR ALL
  USING (true)
  WITH CHECK (true);


-- ─────────────────────────────────────────────
-- 4. Change Requests (Layer 2 — Guardrail)
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS change_requests (
  id                   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id           UUID        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  raw_message          TEXT        NOT NULL,
  requested_items      JSONB       NOT NULL,
    -- e.g. [{ "title": "WhatsApp 2FA", "hours": 6, "cost_inr": 7500 }]
  drift_hours          INTEGER     NOT NULL CHECK (drift_hours >= 0),
  drift_cost_inr       NUMERIC     NOT NULL CHECK (drift_cost_inr >= 0),
  resolution_type      TEXT        NOT NULL
                                   CHECK (resolution_type IN ('scope_swap', 'paid_addon', 'defer_phase_2')),
  swapped_out_item_id  UUID        REFERENCES scope_items(id) ON DELETE SET NULL,
  approval_token       TEXT        NOT NULL UNIQUE,
  approval_status      TEXT        NOT NULL DEFAULT 'pending'
                                   CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS change_requests_project_id_idx
  ON change_requests (project_id);

CREATE INDEX IF NOT EXISTS change_requests_approval_token_idx
  ON change_requests (approval_token);

CREATE INDEX IF NOT EXISTS change_requests_approval_status_idx
  ON change_requests (project_id, approval_status);

COMMENT ON TABLE  change_requests                  IS 'Mid-sprint scope changes detected and resolved by Layer 2 Guardrail.';
COMMENT ON COLUMN change_requests.requested_items  IS 'JSONB array of { title, hours, cost_inr } items extracted from client message.';
COMMENT ON COLUMN change_requests.approval_token   IS 'URL-safe token used in /approve/[token] public portal, e.g. demo-csc-892a.';

ALTER TABLE change_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agency members can manage change requests"
  ON change_requests
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Public read for the client approval portal (no auth required)
CREATE POLICY "Public can read change request by approval token"
  ON change_requests
  FOR SELECT
  USING (true);  -- Restrict to: approval_token = current_setting('app.approval_token', true)


-- ─────────────────────────────────────────────
-- 5. Audit Ledger (Immutable Event Log)
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS audit_ledger (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id        UUID        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  verification_hash TEXT        NOT NULL,  -- e.g. '#CSC-892A'
  event_type        TEXT        NOT NULL
                                CHECK (event_type IN ('sow_clarified', 'scope_swap', 'paid_addon', 'deferred')),
  summary           TEXT        NOT NULL,  -- Human-readable one-liner for the ledger row
  delta_hours       INTEGER     NOT NULL DEFAULT 0,  -- Signed: positive = added, negative = reclaimed
  delta_cost_inr    NUMERIC     NOT NULL DEFAULT 0,  -- Signed: positive = cost, negative = saving
  actor             TEXT        NOT NULL,  -- 'Agency Lead' | 'Client Approved' | 'System'
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS audit_ledger_project_id_idx
  ON audit_ledger (project_id, created_at DESC);

COMMENT ON TABLE  audit_ledger                  IS 'Immutable append-only log of all scope events for the Audit Ledger view.';
COMMENT ON COLUMN audit_ledger.verification_hash IS 'Short tamper-evident hash, e.g. #CSC-892A, displayed in tabular-nums mono font.';
COMMENT ON COLUMN audit_ledger.delta_hours        IS 'Signed hour delta: positive = hours added, negative = hours reclaimed.';
COMMENT ON COLUMN audit_ledger.delta_cost_inr     IS 'Signed rupee delta: positive = cost added, negative = saving.';

ALTER TABLE audit_ledger ENABLE ROW LEVEL SECURITY;

-- Ledger is append-only: allow INSERT but no UPDATE or DELETE
CREATE POLICY "Agency members can append to audit ledger"
  ON audit_ledger
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Agency members and clients can read audit ledger"
  ON audit_ledger
  FOR SELECT
  USING (true);


-- ─────────────────────────────────────────────
-- 6. VastraKart Demo Seed Data
-- ─────────────────────────────────────────────
-- Wrapped in a DO block so it's idempotent (safe to re-run).

DO $$
DECLARE
  v_project_id UUID;
BEGIN
  -- Skip seed if the VastraKart project already exists
  SELECT id INTO v_project_id FROM projects
  WHERE client_name = 'VastraKart' LIMIT 1;

  IF v_project_id IS NULL THEN

    -- Insert demo project
    INSERT INTO projects (id, agency_name, client_name, title, budget_cap_inr, total_hours, status)
    VALUES (
      'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      'PixelCraft Studio',
      'VastraKart',
      'VastraKart E-commerce Platform — Phase 1',
      150000,  -- ₹1,50,000
      120,     -- 120 hrs
      'active'
    )
    RETURNING id INTO v_project_id;

    -- Insert demo SOW ambiguities
    INSERT INTO sow_ambiguities
      (project_id, clause_title, vague_excerpt, missing_details, clarification_question, status)
    VALUES
      (
        v_project_id,
        'User Authentication',
        'Include user login and profile page.',
        'Login provider and security level not defined (Email/Password vs. Google OAuth vs. SMS/WhatsApp OTP).',
        'Should Phase 1 include Email/Password login only, or social OAuth and 2FA?',
        'open'
      ),
      (
        v_project_id,
        'Order Reporting',
        'Admin dashboard with order reports.',
        'Export formats (CSV, Excel, PDF) and custom date filters are not specified.',
        'Is on-screen table view sufficient for Phase 1, or is downloadable Excel/CSV export required?',
        'open'
      );

    -- Insert demo scope items
    INSERT INTO scope_items (project_id, title, hours, status, is_swappable) VALUES
      (v_project_id, 'Auth & Email Login',               16,  'completed',   false),
      (v_project_id, 'Product Catalogue & Filters',      20,  'in_progress', false),
      (v_project_id, 'Shopping Cart & Checkout',         18,  'in_progress', false),
      (v_project_id, 'Admin Dashboard (Basic)',          16,  'not_started', false),
      (v_project_id, 'Mobile-Responsive Storefront',     14,  'not_started', true),  -- Swappable
      (v_project_id, 'Push Notification Banners',        10,  'not_started', true),  -- Swappable
      (v_project_id, 'Wishlist & Save for Later',        12,  'not_started', true),  -- Swappable
      (v_project_id, 'Order History & Tracking',         14,  'not_started', false);

    -- Insert demo change request (WhatsApp 2FA + CSV Export drift scenario)
    INSERT INTO change_requests
      (project_id, raw_message, requested_items, drift_hours, drift_cost_inr,
       resolution_type, approval_token, approval_status)
    VALUES (
      v_project_id,
      'Hi team! Can we also add WhatsApp OTP login and an Excel export for orders? The business team really needs both.',
      '[
        {"title": "WhatsApp / SMS 2FA OTP", "hours": 6, "cost_inr": 7500},
        {"title": "Excel & CSV Order Export", "hours": 8, "cost_inr": 10000}
      ]'::JSONB,
      14,       -- drift_hours
      17500,    -- drift_cost_inr (14 hrs × ₹1,250)
      'scope_swap',
      'demo-csc-892a',
      'pending'
    );

    -- Insert demo audit ledger entries
    INSERT INTO audit_ledger
      (project_id, verification_hash, event_type, summary, delta_hours, delta_cost_inr, actor)
    VALUES
      (
        v_project_id,
        '#CSC-001A',
        'sow_clarified',
        'SOW Clarified: Auth & Email Login locked to Email/Password only. OAuth deferred to Phase 2.',
        0, 0,
        'Agency Lead'
      ),
      (
        v_project_id,
        '#CSC-892A',
        'scope_swap',
        'Scope swap: added [WhatsApp 2FA, CSV Export] (+14 hrs); deferred [Mobile-Responsive Storefront] (−14 hrs). Net Δ: 0 hrs / ₹0.',
        0, 0,
        'Client Approved'
      );

  END IF;
END $$;
