import sys,json,sqlite3
from pathlib import Path
db=sqlite3.connect(':memory:');db.row_factory=sqlite3.Row;db.execute('PRAGMA foreign_keys=ON')
for migration in sorted((Path(__file__).resolve().parents[1]/'drizzle').glob('*.sql')):db.executescript(migration.read_text())
for line in sys.stdin:
 try:
  request=json.loads(line);results=[]
  with db:
   for statement in request['statements']:
    cursor=db.execute(statement['sql'],statement.get('args',[]));results.append([dict(row) for row in cursor.fetchall()])
  print(json.dumps({'results':results}),flush=True)
 except Exception as e:print(json.dumps({'error':str(e)}),flush=True)
