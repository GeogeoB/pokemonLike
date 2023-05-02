from PIL import Image
import numpy

pic = Image.open('../client/src/img/room/tuto/map_collision.png')

pix = numpy.array(pic)
pix = pix[:,:,0]
print(pix.shape)


t = "["
for i in range(len(pix)):
    l = "["
    for j in range(len(pix[0])):
        l += str(pix[i,j]) + ","
    l += "]"
    t += l + "," + "\n"

with open("test.txt", "w+") as file:
    file.write(t)
