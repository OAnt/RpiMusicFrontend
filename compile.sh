#! /bin/bash

COMPILERPATH=~/custompackage/closure/compiler.jar
STATICPATH=~/data/static
TEMPPATH=$STATICPATH/js/Temp.js
MINPATH=$STATICPATH/js/baseApp.min.js

cat /dev/null > $TEMPPATH
cat /dev/null > $MINPATH
DIRECTORIES=$(cat ./conf.txt)
for dir in $DIRECTORIES; 
do
    cat $dir >> $TEMPPATH    
done

java -jar $COMPILERPATH --compilation_level SIMPLE_OPTIMIZATIONS --js $TEMPPATH --js_output_file $MINPATH

