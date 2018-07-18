# csc360-a2-parser
An attempt at parsing data using vim... it didn't work

We run the binary of our complied C program, `rrsim.c`, which outputs huge files containing many rows of data.
There are patterns in this data.
You can write a general parsing algorithm by identifying key sequences of characters that occur repeatedly in the data,
and program those key sequences into clever Vim macros.

Running vim over large datasets with a vim script looks like: `@y10000@x@k@p`, here's an explanation:

1. run macro stored in y
2. run macro stored in x 10000 times
3. run macro stored in k
4. run macro stored in p

In my case this worked on my specific file shape to produce JSON. Your vim instance must have some macros initialized: `vim -u my_vim_rc_with_macros.whatever`

You can see for yourself what that looks like in the files.

In my case I had about 40 of these files to comb through, 2 for each of the 20 simulations that were ran.

Vim is parsing it into JSON. In javascript, you simply `require('./that/json')` in your code, and bang, you have a big list of exactly the numbers you want from your huge files containing rows and rows of data.

I think it's pretty neat. I mostly think this is neat because of how quick it is. How the hell else are you going to parse your code? I guess the better option would be to output your data as JSON but I didn't try and do that in C, though it may have worked better.

Regarding the quickness of this solution, you simply open Vim and start recording macros. In half an hour you can have a reliable set of macros that can parse big data sets; for me, this took about 20 minutes to parse the data. Vim is pretty fast at running these macros as well.

The big issue that I ran into was that the files were not being saved once they were parsed; that, or they were not being parsed at all.

It probably has something to do with the concurrency that is occuring because I'm running these Vim instances all at the same time.

I did not give myself enough time to debug it and well, it flopped. Oh well. rrsim seems to work correctly for this assignment.

-louis
