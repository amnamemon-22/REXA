# REXA frontend/backend API handoff

This document separates contracts verified in the current backend source from proposed contracts that need agreement. No backend code or schema changes are included in this handoff.

## Verified existing contracts

All paths below are mounted under the existing `/api` prefix. JSON endpoints use the existing `ApiResponse` envelope (`data`, `success`, optional `message`). Authentication uses the existing bearer token.

### User management

- `GET /users?page=1&pageSize=20` — admin only. Returns paginated user records (`id`, `name`, `email`, `role`, `rollNumber`, `createdAt`). Current frontend role editing uses `PATCH /users/{user_id}/role` with `{ "role": "student" | "teacher" | "admin" }`, admin only.
- Backend validation/errors include 400 for invalid role, self-role changes, or demoting the last admin; 404 for an unknown user. Existing 401/403 authorization errors also apply.
- Source: `backend/app/routers/users.py`, `backend/app/schemas/__init__.py`.

### Annotations

- `GET /annotations?page=1&pageSize=20&submission_id={id}` — teacher/admin; paginated annotation records.
- `POST /annotations` — teacher/admin. Requires `submission_id` or `analysis_id`; accepts `sentence_roles`, `concepts_present`, `support_pairs`, `depth_score`, `star_label`, and `notes`.
- `GET /annotations/{annotation_id}`, `PUT /annotations/{annotation_id}`, `DELETE /annotations/{annotation_id}` — teacher/admin. PUT accepts optional fields from the annotation payload; DELETE returns success with no data.
- Backend returns 404 when analysis, submission, or annotation is not found; invalid/missing target is a validation error. Standard auth errors apply.
- Annotation records and analysis-run records both expose `submission_id`, so the frontend can match reviewed submissions without confusing an analysis-run ID with a submission ID. Annotation edits/deletes target the annotation ID. Update requests omit read-only `star_label` and `support_pairs`, preventing this UI from overwriting those saved fields.
- Source: `backend/app/routers/annotations.py`, `backend/app/schemas/__init__.py`.

### Analytics and analysis records

- `GET /analytics/dashboard` — authenticated user; student responses are scoped to the student, teacher/admin responses provide aggregate data. The existing shared dashboard already consumes this service.
- `GET /analyses?page=1&pageSize=20&question_id={optional}` and `GET /analyses/{analysis_id}` are present. Responses include analysis IDs and `submission_id`; students are scoped to their own analyses, while teacher/admin results are aggregate. This supports analysis records but is not a student-account roster or a per-student history query. No dedicated student-roster endpoint was found.
- Source: `backend/app/routers/analytics.py`, `backend/app/routers/analysis.py`.

### Baseline evaluation

- `GET /baselines/evaluate?question_id={optional}` — teacher only. It evaluates a selected/latest question against one recent submission (or reference answer) and returns `question_text`, `reference_answer`, `student_answer`, `rexa_stars`, and `baselines[]` (`name`, `score`, `predicted_stars`, `details`). It returns 404 when the question does not exist or no question is available.
- This is an on-demand baseline comparison, not the dataset-level evaluation metrics currently read by `EvaluationPage` from static public JSON files. Do not silently replace the static research report with this endpoint.
- Source: `backend/app/routers/models_admin.py`, `backend/app/schemas/__init__.py`.

### Authentication

- Verified routes: `POST /auth/login`, `POST /auth/register`, `GET /auth/me`, `POST /auth/logout`. No profile-update or password-reset request/verification/reset endpoints were found.
- Source: `backend/app/routers/auth.py`.

### Support contact verification

- Repository inspection found no configured support endpoint or verified support email/contact channel. Email addresses in the backend documentation and fixtures are demo/test accounts, not support contacts; they must not be displayed as such.
- Guidance-only Help requires no API. The current UI directs users to an instructor or project administrator through an institution-approved channel and does not claim to send messages.

## Proposed contracts requiring backend agreement

### Profile editing

- Proposed `PATCH /auth/me` (authenticated user may edit only their own allowed fields; no such update route currently exists).
- Request: `{ "name": string }` (email changes should be excluded unless verification is specified). Do not allow clients to change `role`, `id`, or authorization fields.
- Response: existing user response shape (`id`, `name`, `email`, `avatarUrl`, `role`, `rollNumber`) inside `ApiResponse`.
- Validation: trimmed name with agreed minimum/maximum lengths; reject empty values. Errors: 400 validation, 401 unauthenticated, 409 if a future verified email change conflicts, and 5xx service failure.
- The frontend must not show a saved state until the server confirms the update.

### Password reset

Agree on a complete reset flow before enabling a real form submission:

1. `POST /auth/password-reset/request` request `{ "email": string }`; return a generic confirmation regardless of account existence to limit account enumeration.
2. `POST /auth/password-reset/verify` request `{ "token": string }`; return a short-lived verified reset grant or equivalent server-controlled result.
3. `POST /auth/password-reset/confirm` request `{ "token": string, "new_password": string }`; return success only after the password is changed.

Require rate limits, expiring single-use tokens, secure delivery, agreed password policy, and generic 200 responses for request submission. Validate email and token format; enforce the agreed password rules on confirmation. Return 400/422 for invalid input, 429 for rate limits, a generic response for request submission to avoid account enumeration, and a consistent invalid/expired-token response (for example 400) without revealing account state. Define 5xx behavior. The current frontend intentionally does not simulate delivery, verification, or password change.

### Teacher student records

- No suitable teacher-scoped roster or per-student history endpoint was found. Existing `/analyses` is an analysis-record list, not a roster contract, and `/users` is admin-only.
- Proposed teacher-scoped `GET /teacher/students?page=&pageSize=&search=&class_id=` response `ApiResponse<PaginatedData<StudentRecord>>`, with each record containing `id`, `name`, `student_id` or `roll_number` (agree on the canonical identifier), and optional class metadata.
- Proposed `GET /teacher/students/{student_id}/analyses?page=&pageSize=&from=&to=` response `ApiResponse<PaginatedData<StudentAnalysisRecord>>`, returning the authorized analysis ID, question, timestamp, and existing analysis summary fields.
- If classes are first-class backend entities, define class membership and teacher ownership in the backend contract rather than trusting a client-supplied class ID.
- Authorization: teacher may read only their own assigned class/student records; admin access can be separately agreed. Never expose `GET /users` to teachers.
- Validation/errors: bounded pagination, normalized search, 400/422 invalid filters, 401/403 authorization, 404 unknown/out-of-scope student, and standard 5xx responses.

### Achievements

- Only if achievements are included in approved scope: proposed `GET /students/me/achievements` for the authenticated student, returning `data: []` when no awards exist, or earned records with `id`, `key`, `title`, `description`, `earned_at`, and explicitly defined optional progress. No current endpoint or persistence was found.
- Backend must define achievement identifiers, rules, award timestamp, progress semantics, persistence, and recalculation policy. Authorization must scope results to the student; teacher/admin visibility requires an explicit separate policy.
- Empty records should return a successful empty list, not fabricated defaults. Define 401/403 and 5xx errors.

### Dataset/model evaluation

- Only if live dataset-wide evaluation is required by the research objectives: propose `POST /evaluation/runs` with `{ "dataset_version": string, "model_version": string }`, returning a run ID/status, followed by `GET /evaluation/runs/{run_id}` for completion and results. Results should identify dataset/model versions, run timestamps, metric definitions, metric values, and artifact provenance. Agree whether evaluation is teacher- or admin-only; admin-only is preferable if arbitrary datasets/models can be selected. Validate allowed registered versions and return 400/422 for invalid selections, 401/403 for access errors, 404 for an unknown run, and a stable failed-run payload for processing errors.
- The current static evaluation report needs versioned provenance (dataset/version, metric definitions, evaluation date, artifact/model version) if it is to be served dynamically. No dataset-wide evaluation endpoint was found.
- The existing baseline endpoint is verified for one sample question only. Before connecting it to the page, agree on whether the UI should run that comparison, how a question is selected, and whether response fields above are sufficient. Do not label those results as corpus-wide evaluation metrics.

### Teacher Help & Support

- No support/ticket API is needed for the current guidance-only Help page. If in-app support is required, propose authenticated `POST /support/messages` with `{ "subject": string, "message": string, "context": optional string }`; derive sender identity from the bearer token, never accept a client-supplied user ID. Return a created ticket/message ID and status in `ApiResponse`. Validate subject and message lengths, sanitize rendered content, rate-limit submissions, and define 400/422, 401, 429, and 5xx responses. Define who can read/respond to messages and how notifications work before adding a frontend form. The frontend currently does not claim to create tickets or contact an institution.
