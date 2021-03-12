import json
from random import randint

conditions = {0: "pen,mouse", 1: "pen,touch", 
2: "pen,trackpad", 3: "mouse,touch",
4: "mouse,trackpad", 5: "touch,trackpad"}

def create_latin_square(n: int, start_el: int=1):
    row = [i for i in range(0, n)]
    row = row[start_el-1:] + row[:start_el-1]
    return [row[i:] + row[:i] for i in range(n)]

def print_matrix(n):
    for row in n:
        print(row)

square = create_latin_square(6)

square = square + square

cond_matrix = []

for i in range(len(square)):
    l = []
    for j in range(len(square[i])):
        l.append(conditions[square[i][j]])
    cond_matrix.append(l)

#intro, instructions1, 
#training1, cond1, 
#instructions2, training2, cond2, 
#instructions3, training3, cond3, 
#instructions4, training4, cond4 
#instructions5, training5, cond5,
#instructions6, training6, cond6

timelines = {}

for p in range(len(cond_matrix)):
    tl = []
    tl.append('info')
    for i in range(len(cond_matrix[p])):
        tl.append("instruction," + cond_matrix[p][i])
        #tl.append("training," + cond_matrix[p][i])
        tl.append("task," + cond_matrix[p][i])
    timelines[p+1] = tl

print(timelines)

with open('public/timelines.json', 'w') as f:
    json.dump(timelines, f, indent=2)