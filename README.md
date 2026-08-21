# Revision Banks

One personal, always-current revision bank per student, served by GitHub Pages.

- `index.html` — tutor roster (reads the repo live; not linked from anywhere public)
- `_engine/` — shared page logic and styles. Edit once, every student gets it.
- `_tools/new-student.html` — generates a new student folder's two files
- `_tools/new-entry.html` — generates a seed entry to paste into a student's `seed.js`
- `<firstname-xxxx>/index.html` + `seed.js` — one folder per student

Student link: `https://learningcurvecollective.github.io/revision-banks/<slug>/`

Rules: never reuse a seed `id`; never rename a student folder after the link is sent.
Students' own logged misses live in their browser (localStorage + IndexedDB), never in this repo.
