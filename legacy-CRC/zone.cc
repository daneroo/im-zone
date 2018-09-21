

#include <Ops/Ops.h>
#include <stdlib.h>

void vtzone(image &ima,float t) {

#define PI    3.141592653589793
#define PI2   2*PI

    double cx=ima.cols/2;
    double cy=ima.rows/2;
    register int i,j;

    for (j=0;j<ima.rows;j++){
      double y = double(j-cy)/ima.rows;
      for (i=0;i<ima.cols;i++){
        double x = double(i-cx)/ima.cols;
        double phi = (30*2*x*t+ima.rows*y*y)*PI2;
        ima.bitmap[j][i] =  (pixel) (sin(phi)*126.+127.);
      }
    }
}

main(int argc, char **argv) {

  char seq[]  = "/i6/daniel/vtzone.ops";
  const int frames = 30,rows=1024,cols=1920;
  header h(seq,YUV,frames,rows,cols);    h.write();

  //const int frames = 30,rows=128,cols=128;
  //header h(seq,Y,frames,rows,cols);    h.write();
  
  image uv(rows,cols/2);
  uv.set(128);
  for (int i=0;i<rows;i++ ) uv.bitmap[i][cols/4] = 100;
  for (int i=0;i<cols/2;i++ ) uv.bitmap[rows/2][i] = 100;
  uv.bitmap[rows/2][cols/4]  = 156;
  image ima(rows,cols);

  for (int t=0;t<frames;t++) {  
    vtzone(ima,float(t)/frames-.5);
    ima.append(seq,t+1);
    uv.append(seq,999);
    uv.append(seq,999);
  }
  /*
  char command[1024];
  sprintf(command,"tail +1024c %s | rawtorle -h %d -w %d -n 1 | rleflip -v | getx11 -m",
    seq, rows, cols);
  printf("%s\n",command);
  system(command);
  */
/*
tail +1024c vtzonesmall.ops | rawtorle -h 128 -w 16 -n 1 | rleflip -v > vtzonesmall.rle
convert -delay 5 -loop 100 vtzonesmall.rle vtzonesmall.gif
*/
}
