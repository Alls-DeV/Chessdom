from PIL import Image
import os

# set the desired size
size = (64, 64)

# loop through each folder in the directory
for folder in os.listdir('.'):
    if os.path.isdir(folder):
        print(folder)
        # loop through each file in the folder
        for file in os.listdir(folder):
            # check if it's an image file
            if file.endswith('.png') or file.endswith('.jpg'):
                # open the image file
                img = Image.open(os.path.join(folder, file))
                
                # resize the image
                img = img.resize(size)
                
                # save the resized image with the same name as original
                img.save(os.path.join(folder, file))