# Land Record User Registration Backend

Spring Boot backend for a land-record user registration flow with admin approval.

## Design

Single table (`land_users`) with a `status` column: `PENDING` -> `APPROVED` / `REJECTED`.
A new registration is saved as `PENDING` — this **is** the "temporary" storage: it's a
real row in the DB, but not treated as a valid/confirmed user until an admin approves it.
This avoids data loss (a separate in-memory/temp store risks losing submissions on
restart) and gives you a full audit trail for free.

Aadhar numbers are never stored in plaintext — only a SHA-256 hash (for uniqueness
checks) and a masked display form (`XXXX-XXXX-1234`).

## Setup

1. Create the database:
   ```sql
   CREATE DATABASE land_record_db;
   ```
2. Edit `src/main/resources/application.properties` — set your MySQL username/password.
3. Run:
   ```bash
   mvn spring-boot:run
   ```
   Tables are auto-created via `ddl-auto=update`.

## Auth (placeholder — replace before production)

A single in-memory admin user is defined in `SecurityConfig`:
- username: `admin`
- password: `changeMe123!`

Uses HTTP Basic auth. Replace with a DB-backed admin table + JWT for real deployments.

## API

### Public

**POST** `/api/register`
```json
{
  "name": "Ramesh Kumar",
  "age": 34,
  "aadharNumber": "123456789012",
  "mobile": "9876543210",
  "email": "ramesh@example.com"
}
```
Returns `201` with the created record (status `PENDING`) or `409` on duplicate
Aadhar/mobile/email, `400` on validation errors.

**GET** `/api/register/{id}/status` — check review status.

### Admin (requires Basic auth, ADMIN role)

**GET** `/api/admin/registrations/pending` — list all pending registrations.

**GET** `/api/admin/registrations?status=APPROVED` — list by status (omit `status` for all).

**POST** `/api/admin/registrations/{id}/approve` — approve a pending registration.

**POST** `/api/admin/registrations/{id}/reject`
```json
{ "reason": "Aadhar details do not match provided name" }
```

## Validation rules

- Name: letters/spaces only, 2–100 chars
- Age: 18–120
- Aadhar: exactly 12 digits
- Mobile: 10 digits, starts with 6–9 (Indian format)
- Email: standard email format
- Duplicate Aadhar, mobile, or email are all rejected at submission time
