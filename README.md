# Revision Banks

One personal, always-current revision bank per student, served by GitHub Pages.

- `index.html` — tutor roster (reads the repo live; not linked from anywhere public)
- `_engine/` — shared logic and styles. Edit once, every student on that engine gets it.
  - `bank.js` / `bank.css` — miss-log engine (Shivani style)
  - `practice.js` / `practice.css` — practice engine (Charlotte style: seeded problems, Learn/Test sessions, scheduler, error log, calibration)
- `_tools/new-student.html` — generates a new student folder's two files
- `_tools/new-entry.html` — generates a seed entry to paste into a student's `seed.js`
- `<firstname-xxxx>/index.html` + `seed.js` — one folder per student

Student link: `https://learningcurvecollective.github.io/revision-banks/<slug>/`

Rules: never reuse a seed `id`; never rename a student folder after the link is sent.
Students' own progress lives in their browser (localStorage + IndexedDB), never in this repo.
Practice-engine settings live in the student's `index.html` (`requireReattempt`, `tutor`, `exam`). Add `?tutor` to a student URL for tutor controls.
