import os

with open('tmp.txt', 'r') as f:
    lines = f.readlines()

for i in range(len(lines)):
    if lines[i][0] == '/':
        continue
    # toggle upper lower case
    lines[i] = lines[i][:-4] + lines[i][-4].swapcase() + lines[i][-3:]

with open('tmp.txt', 'w') as f:
    f.writelines(lines)