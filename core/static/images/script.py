import os

# each file with name b*.png will be renamed to *.png
# each file with name w*.png will be renamed to *.png but with * in lowercase

for filename in os.listdir('.'):
    if filename.startswith('b'):
        os.rename(filename, filename[1:])
    elif filename.startswith('w'):
        os.rename(filename, filename[1:].lower())