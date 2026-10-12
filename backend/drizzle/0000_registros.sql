CREATE TABLE students (
 id TEXT PRIMARY KEY NOT NULL,
 full_name TEXT NOT NULL CHECK(length(trim(full_name)) BETWEEN 3 AND 120),
 email TEXT COLLATE NOCASE UNIQUE,
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE courses (id TEXT PRIMARY KEY NOT NULL, title TEXT NOT NULL);
--> statement-breakpoint
CREATE TABLE topics (
 id TEXT PRIMARY KEY NOT NULL,
 course_id TEXT NOT NULL REFERENCES courses(id),
 title TEXT NOT NULL,
 position INTEGER NOT NULL,
 UNIQUE(id,course_id),
 UNIQUE(course_id,position)
);
--> statement-breakpoint
CREATE TABLE enrollments (
 student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
 course_id TEXT NOT NULL REFERENCES courses(id),
 enrolled_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY(student_id,course_id)
);
--> statement-breakpoint
CREATE TABLE progress (
 student_id TEXT NOT NULL,
 course_id TEXT NOT NULL,
 topic_id TEXT NOT NULL,
 viewed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY(student_id,topic_id),
 FOREIGN KEY(student_id,course_id) REFERENCES enrollments(student_id,course_id) ON DELETE CASCADE,
 FOREIGN KEY(topic_id,course_id) REFERENCES topics(id,course_id)
);
--> statement-breakpoint
CREATE TABLE notes (
 id TEXT PRIMARY KEY NOT NULL,
 student_id TEXT NOT NULL,
 course_id TEXT NOT NULL,
 topic_id TEXT,
 content TEXT NOT NULL CHECK(length(content) BETWEEN 1 AND 10000),
 updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(student_id,course_id) REFERENCES enrollments(student_id,course_id) ON DELETE CASCADE,
 FOREIGN KEY(topic_id,course_id) REFERENCES topics(id,course_id)
);
--> statement-breakpoint
CREATE INDEX notes_student_idx ON notes(student_id);
--> statement-breakpoint
CREATE INDEX progress_course_idx ON progress(course_id,topic_id);
