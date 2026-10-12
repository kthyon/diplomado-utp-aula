ALTER TABLE students ADD COLUMN auth_subject TEXT;
--> statement-breakpoint
CREATE UNIQUE INDEX students_auth_subject_idx ON students(auth_subject) WHERE auth_subject IS NOT NULL;
--> statement-breakpoint
ALTER TABLE notes ADD COLUMN owner_scope TEXT NOT NULL DEFAULT 'teacher';
