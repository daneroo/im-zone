include ${HOME}/.default.mk


LDLIBS = -L${HOME}/Code/Entropy -L${HOME}/Code/Ops -L${HOME}/Code/Vids \
       -lEntropy -lOps -lg++ -lViDS -lstdc++ -lm

#It seems that stl and opptimisation don't cohabitate well !       
CCFLAGS = -O -I${HOME}/Code -I${HOME}/Code/Vids -Wall -g

EXECS = zone
all		:  ${EXECS}

clean	: 
	touch coco~
	rm -f ${EXECS} core *.o *% #*# *~ 
