import fitz
from pathlib import Path
p = Path(r'c:/Users/siddh/OneDrive/Desktop/LIbrary pep/assets-download/Azure project Campus Managment Siddharth.pdf')
doc = fitz.open(p)
print('pages', len(doc))
for i in range(min(3, len(doc))):
    print('--- PAGE', i+1, '---')
    lines = doc[i].get_text().splitlines()
    for line in lines[:80]:
        print(line)
    print()
