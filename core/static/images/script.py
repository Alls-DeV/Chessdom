from PIL import Image
import os

# set the desired size
size = (56, 56)

# loop through each folder in the directory
for folder in os.listdir('.'):
    if folder == 'trash.png':
        file = folder
        img = Image.open(file)
        
        # resize the image
        img = img.resize(size)
        
        # save the resized image with the same name as original
        img.save(file) 