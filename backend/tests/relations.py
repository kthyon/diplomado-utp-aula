import sqlite3
from pathlib import Path
db=sqlite3.connect(':memory:')
db.execute('PRAGMA foreign_keys=ON')
db.executescript((Path(__file__).resolve().parents[1]/'drizzle/0000_registros.sql').read_text())
db.execute("INSERT INTO courses VALUES ('ml','ML')")
db.execute("INSERT INTO courses VALUES ('dl','DL')")
db.execute("INSERT INTO topics VALUES ('ml-a','ml','Tema',1)")
db.execute("INSERT INTO students(id,full_name,email) VALUES ('s1','Prueba Ficticia','ficticio@example.test')")
db.execute("INSERT INTO enrollments(student_id,course_id) VALUES ('s1','ml')")
db.execute("INSERT INTO progress(student_id,course_id,topic_id) VALUES ('s1','ml','ml-a')")
db.execute("INSERT INTO notes(id,student_id,course_id,content) VALUES ('n1','s1','ml','Nota ficticia')")
for sql in ["INSERT INTO students(id,full_name,email) VALUES ('s2','Otro Ejemplo','FICTICIO@EXAMPLE.TEST')", "INSERT INTO progress(student_id,course_id,topic_id) VALUES ('s1','dl','ml-a')", "INSERT INTO enrollments(student_id,course_id) VALUES ('ausente','ml')"]:
 try:
  db.execute(sql)
  raise AssertionError('Se permitió una relación inválida')
 except sqlite3.IntegrityError:
  pass
db.execute('DELETE FROM students')
for t in ['students','enrollments','progress','notes']:
 assert db.execute('SELECT count(*) FROM '+t).fetchone()[0]==0
assert db.execute('SELECT count(*) FROM courses').fetchone()[0]==2
print('Integridad, correo único y limpieza en cascada: correctos. Solo datos ficticios en memoria.')
