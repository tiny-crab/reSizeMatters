# reSizeMatters
A grid system that I made for future projects.

I wanted a grid system that would resize more than once. I was tired of grids that would only resize when the
smallest columns would get too scrunched to see, and oftentimes that was too small.

I wanted a grid system that would center my rows properly, instead of having me trying to implement little tweaks in
"main.css" in order to make custom column layouts sit inside the container correctly.

I wanted something cool to put on my resume.

I wanted to understand the systems in place to make a grid system, so I would learn more about HTML, CSS, and JS all
at once.

I was also too lazy to fully understand the notation for other grid systems.

Mine only comes with a few simple rules.

1. Use a ".container" div around your grid. Change the width as much as you want.

2. Use ".fluid" and ".row" to indicate rows that will resize and reposition themselves properly in the browser. Don't
use ".fluid" if you want to keep tables of data lined up nicely or nav buttons side-by-side.

3. Use ".column" to indicate columns. Use ".one", ".two", ".three", etc. Put these inside rows. This grid uses a
12-column system, so make all of your columns add up to 12 inside of a row. Or don't. The JS will automatically
center your not-full rows inside of your container.

4. Create your own divs inside of the ".column" divs. Manipulating HTML elements that are children of these columns
will make your life much easier, rather than trying to format the columns themselves.

5. Enjoy yourself.

**5x. Report bugs!**

Ideas that may or may not be implemented:
  - "centered" class on a col is the only time centerRows() is called on a row, instead of all rows in default
  - Use different width properties in order to let column divs to be manipulated properly. Right now, a new div needs to be created
    inside of a column div
  - Add "priority" col class, so a col marked with priority gets added to its own row before other children (for layout)
  - Working on a demo website!
