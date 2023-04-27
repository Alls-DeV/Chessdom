import os

with open('tmp.txt', 'r') as f:
    miao = f.read()

f = open('openings.txt', 'w')

miao = miao[1:-1].split('},{')
for a in miao:
    a = a.split(',')
    for i in range(len(a)):
        a[i] = a[i].split(':')
        for j in range(len(a[i])):
            a[i][j] = a[i][j][1:-1]
        a[i] = a[i][1]
    a = a[0] + " " + a[1] + ":" + a[2]
    f.write(a + '\n')