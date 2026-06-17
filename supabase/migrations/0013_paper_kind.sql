-- Distinguish practice worksheets from assessment/test papers.
alter table public.assessment_papers add column if not exists kind text not null default 'test';
-- existing rows stay 'test'; worksheets are inserted with kind = 'worksheet'.
