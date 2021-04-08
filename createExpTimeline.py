import json
from random import shuffle, randint

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
NUM_OF_BLOCKS = 2
NUM_OF_CIRCS = 5

for p in range(len(cond_matrix)):
    tl = []
    tl.append({"stage": 'info'})
    tl.append({"stage": 'consent'})
    for i in range(len(cond_matrix[p])):
        #tl.append("instruction," + cond_matrix[p][i])
        conds = cond_matrix[p][i].split(',')
        shuffle(conds)

        tl.append({"stage" : "instruction", "conds": [conds[0], conds[0]]})
        tl.append({"stage" : "baseline", 
            "conds": [conds[0], conds[0]],
            "block": "1",
            "startPos": randint(0, NUM_OF_CIRCS)})
        tl.append({"stage": "instruction", "conds": [conds[1],  conds[1]]})
        tl.append({"stage" : "baseline", 
            "conds": [conds[1], conds[1]],
            "block": "1",
            "startPos": randint(0, NUM_OF_CIRCS)})

        tl.append({"stage": "instruction", "conds": [conds[0], conds[1]]})

        for j in range(NUM_OF_BLOCKS):
            tl.append({"stage": "task,", 
                "conds": [conds[0], conds[1]], 
                "block": str(j),
                "startPos": randint(0, NUM_OF_CIRCS)})

        tl.append({"stage": "instruction", "conds": [conds[1],  conds[1]]})
        tl.append({"stage" : "baseline", 
            "conds": [conds[1], conds[1]],
            "block": "2",
            "startPos": randint(0, NUM_OF_CIRCS)})
        tl.append({"stage" : "instruction", "conds": [conds[0], conds[0]]})
        tl.append({"stage" : "baseline", 
            "conds": [conds[0], conds[0]],
            "block": "2",
            "startPos": randint(0, NUM_OF_CIRCS)})

        tl.append({"stage" :"survey"})
        tl.append({"stage" :"done"})
    timelines[p+1] = tl

timelines['desktop'] = [
    {"stage" : "info"},
    {"stage" : "consent"},
    {"stage" : "instruction",
    "conds": ["mouse", "mouse"]},
    {"stage": "baseline",
    "conds": ["mouse", "mouse"],
    "block" : "1",
    "startPos" : 0},
    {"stage" : "instruction",
    "conds": ["trackpad", "trackpad"]},
    {"stage": "baseline",
    "conds": ["trackpad", "trackpad"],
    "block" : "1",
    "startPos" : 0},
    {"stage" : "instruction",
    "conds": ["mouse", "trackpad"]},
    {"stage": "task",
    "conds": ["mouse", "trackpad"],
    "block" : "1",
    "startPos" : 0},
    {"stage" : "done"}
]

timelines['allconds'] = [
    {"stage" : "info"},
    {"stage" : "consent"},
    {"stage" : "instruction",
    "conds": ["mouse", "trackpad"]},
    {"stage": "task",
    "conds": ["mouse", "trackpad"],
    "block" : "1",
    "startPos" : 0},
    {"stage" : "instruction",
    "conds": ["pen", "touch"]},
    {"stage": "task",
    "conds": ["pen", "touch"],
    "block" : "1",
    "startPos" : 0},
    {"stage" : "done"}
]

timelines['touchpen'] = [
    {"stage" : "info"},
    {"stage" : "consent"},
    {"stage" : "instruction",
    "conds": ["touch", "pen"]},
    {"stage": "task",
    "conds": ["touch", "pen"],
    "block" : "1",
    "startPos" : 0},
    {"stage" : "instruction",
    "conds": ["pen", "touch"]},
    {"stage": "task",
    "conds": ["pen", "touch"],
    "block" : "2",
    "startPos" : 0},
    {"stage" : "instruction",
    "conds": ["pen", "touch"]},
    {"stage": "task",
    "conds": ["pen", "touch"],
    "block" : "3",
    "startPos" : 0},
    {"stage" : "done"}
]

timelines['speed'] = [
    {"stage" : "info"},
    {"stage" : "consent"},
    {"stage" : "instruction",
    "conds": ["touch", "touch"]},
    {"stage": "baseline",
    "conds": ["touch", "touch"],
    "block" : "1",
    "startPos" : 0},
    {"stage" : "done"}
]

timelines['speed2'] = [
    {"stage" : "info"},
    {"stage" : "consent"},
    {"stage" : "instruction",
    "conds": ["mouse", "mouse"]},
    {"stage": "baseline",
    "conds": ["mouse", "mouse"],
    "block" : "1",
    "startPos" : 0},
    {"stage" : "done"}
]

timelines['3base'] = [
    {"stage" : "info"},
    {"stage" : "consent"},
    {"stage" : "instruction",
    "conds": ["pen", "pen"]},
    {"stage": "baseline",
    "conds": ["pen", "pen"],
    "block" : "1",
    "startPos" : 0},
    {"stage" : "instruction",
    "conds": ["pen", "pen"]},
    {"stage": "baseline",
    "conds": ["pen", "pen"],
    "block" : "2",
    "startPos" : 0},
    {"stage" : "instruction",
    "conds": ["pen", "pen"]},
    {"stage": "baseline",
    "conds": ["pen", "pen"],
    "block" : "3",
    "startPos" : 0},
    {"stage" : "done"}
]

timelines['test1'] = timelines[1]
timelines['test2'] = timelines[2]

#['info','instruction,mouse,trackpad', 'task,trackpad,mouse', 'instruction,mouse,mouse', 'baseline,mouse,mouse', 'done']
#timelines['allconds'] = ['info', 'instruction,mouse,trackpad', 'task,mouse,trackpad', 'instruction,pen,touch', 'task,pen,touch', 'done']

with open('public/timelines.json', 'w') as f:
    json.dump(timelines, f, indent=2)