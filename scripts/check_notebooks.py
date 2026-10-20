"""Offline syntax and publication checks; never installs or executes notebook code."""
import ast
import json
from pathlib import Path

root = Path(__file__).resolve().parents[1] / 'docs' / 'notebooks'
total = 0
for path in sorted(root.glob('*.ipynb')):
    notebook = json.loads(path.read_text(encoding='utf-8'))
    assert notebook['nbformat'] == 4, path.name
    identifiers = set()
    codes = 0
    for index, cell in enumerate(notebook['cells']):
        text = cell['source']
        text = ''.join(text) if isinstance(text, list) else text
        assert isinstance(text, str), (path.name, index)
        if notebook['nbformat_minor'] >= 5:
            identifier = cell['id']
            assert identifier not in identifiers, (path.name, identifier)
            identifiers.add(identifier)
        if cell['cell_type'] == 'code':
            assert cell.get('execution_count') is None, (path.name, index)
            assert not cell.get('outputs'), (path.name, index)
            ast.parse(text, filename=f'{path.name}:cell{index}')
            codes += 1
    total += codes
    print(f'{path.name}: {codes} code cells, syntax OK, no stored outputs')
print(f'{total} code cells checked; execution is a separate verification.')
