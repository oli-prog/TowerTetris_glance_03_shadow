This is the game from the lecture on May 28th.

In order to view it in the browser, you'll have to serve the root directory of this repository, so both "05-28-game" and "glance" are visible from the served location.
I suggest using Python for it, with

    python3 -m http.server

All of the code (except the OpenSimplex2S Noise function, which does not matter for this lecture) are included in the index.html file.
Feel free to play around with the constants and see how things change. You will need to reload the page after every change.


Erweiterung

vertex and fragment shader für terrain "wasser"
fragment shader für box "mirror"

boxPos
w   forward
s   backwards
a   left
d   right
e   up
x   down

boxRotation
i   x left
k   x right
j   y left
l   y right
u   z left
m   z right

