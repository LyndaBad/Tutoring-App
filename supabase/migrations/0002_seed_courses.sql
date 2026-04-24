-- Seed the 20 courses from src/App.jsx COURSES[].
-- Safe to re-run: uses ON CONFLICT DO NOTHING.

insert into courses (id, title, grp, subject, path, level, curriculum, description, rate_gbp, rate_usd, hours_full, hours_half, hours_quarter, lessons) values
  ('ib-aa-sl',  'IB Math AA SL',         'ib',    'math', 'aa', 'sl', 'IB Diploma · SL',       'Full AA SL: algebra, proof, functions, trig, stats, calculus with embedded IA guidance.', 50, 70, 36, 18,  9, 27),
  ('ib-aa-hl',  'IB Math AA HL',         'ib',    'math', 'aa', 'hl', 'IB Diploma · HL',       'Full HL: complex numbers, matrices, proof by induction, ODEs, Paper 3 technique.',         50, 70, 50, 25, 12, 30),
  ('ib-ai-sl',  'IB Math AI SL',         'ib',    'math', 'ai', 'sl', 'IB Diploma · SL',       'Stats-focused: real-world modelling, financial maths, GDC proficiency, data analysis.',    50, 70, 30, 15,  7, 22),
  ('ib-ai-hl',  'IB Math AI HL',         'ib',    'math', 'ai', 'hl', 'IB Diploma · HL',       'Graph theory, Voronoi, Markov chains, advanced stats, Paper 3 technique.',                 50, 70, 42, 21, 10, 25),
  ('ib-chem-sl','IB Chemistry SL',       'ib',    'chem', null, 'sl', 'IB Diploma · SL',       'Complete IB Chem SL — Structure & Reactivity with IA guidance.',                           50, 70, 32, 16,  8, 19),
  ('ib-chem-hl','IB Chemistry HL',       'ib',    'chem', null, 'hl', 'IB Diploma · HL',       'Born-Haber, mechanisms, NMR spectroscopy, multi-step synthesis, IA at HL standard.',       50, 70, 48, 24, 12, 24),
  ('al-math',   'A-Level Mathematics',   'al',    'math', null, null, 'UK AQA/Edexcel/OCR',    'Full A-Level: Pure, Statistics, Mechanics with A* exam technique.',                        45, 60, 45, 22, 11, 19),
  ('al-chem',   'A-Level Chemistry',     'al',    'chem', null, null, 'UK AQA/Edexcel/OCR',    'Physical, Inorganic, Organic — mechanisms, synoptic thinking, competitive prep.',          45, 60, 45, 22, 11, 14),
  ('gcse-math', 'GCSE Mathematics',      'gcse',  'math', null, null, 'UK AQA/Edexcel/OCR · Yr 10–11', 'Higher tier: number, algebra, geometry, statistics with mark-scheme precision.',   38, 50, 36, 18,  9, 13),
  ('gcse-chem', 'GCSE Chemistry',        'gcse',  'chem', null, null, 'UK AQA/Edexcel/OCR · Yr 10–11', 'Full GCSE Chem with six-mark question technique for grade 7–9.',                   38, 50, 30, 15,  7, 11),
  ('pre-gcse-m','Pre-GCSE Maths',        'pre',   'math', null, null, 'UK Years 7–9',          'GCSE readiness: algebraic thinking, number fluency, problem-solving confidence.',         38, 50, 24, 12,  6, 12),
  ('pre-gcse-c','Pre-GCSE Chemistry',    'pre',   'chem', null, null, 'UK Years 7–9',          'Particle thinking, bonding concepts, and quantitative foundations.',                       38, 50, 20, 10,  5, 10),
  ('pre-ib',    'Pre-IB Mathematics',    'preib', 'math', null, null, 'IB Preparation',        'Close the gap before IB — algebraic precision, IB-style problems, SL/HL advice.',          45, 60, 24, 12,  6, 12),
  ('ap-chem',   'AP Chemistry',          'ap',    'chem', null, null, 'College Board — US',    'Full AP Chemistry with FRQ technique — equilibrium, kinetics, electrochemistry.',          45, 60, 40, 20, 10, 15),
  ('hon-math',  'Honors Mathematics',    'hon',   'math', null, null, 'US Accelerated Track',  'Advanced Algebra through Pre-Calculus — depth that makes AP/IB accessible.',              45, 60, 36, 18,  9, 12),
  ('hon-chem',  'Honors Chemistry',      'hon',   'chem', null, null, 'US Accelerated Track',  'Honors depth: stoichiometry, kinetics, thermochemistry with AP preparation.',              45, 60, 36, 18,  9, 12),
  ('ms-math',   'Middle School Math',    'ms',    'math', null, null, 'US Grades 6–8',         'Patient, concept-first MS Maths building algebraic thinking and number sense.',           30, 40, 24, 12,  6, 12),
  ('ms-sci',    'Middle School Science', 'ms',    'sci',  null, null, 'US Grades 6–8',         'Wide-ranging MS Science building vocabulary, inquiry habits, and scientific thinking.',    30, 40, 20, 10,  5, 10),
  ('hs-math',   'High School Math',      'us',    'math', null, null, 'US Grades 9–12',        'Algebra through Pre-Calculus — concept-first sessions making AP and Honors accessible.',  38, 50, 36, 18,  9, 14),
  ('hs-chem',   'High School Chemistry', 'us',    'chem', null, null, 'US Grades 9–12',        'Atomic structure, bonding, stoichiometry, thermochemistry as a coherent whole.',           38, 50, 30, 15,  7, 12)
on conflict (id) do nothing;
