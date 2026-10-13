#!/bin/zsh
# run_batches.sh <scratchdir with ziplist.txt and analyse binary at phototool/phototool> <workdir> <zip>
# Batch: extract ~200 photos, analyse, delete. Resumable via results.jsonl.
S=$1; W=$2; Z=$3
R=$W/results.jsonl; touch $R
grep -iE '\.(jpe?g|heic)$' $S/ziplist.txt > $S/photos.txt
python3 -c "
import json,sys
done={json.loads(l)['file'] for l in open('$R') if l.strip()}
for l in open('$S/photos.txt'):
    if l.strip().split('/')[-1] not in done: print(l.rstrip('\n'))" > $S/todo.txt
split -l 200 $S/todo.txt $S/chunk_
n=0; for c in $S/chunk_*; do
  rm -rf $W/batch; mkdir -p $W/batch; cd $W/batch
  tr '\n' '\0' < $c | xargs -0 unzip -qq -j -o "$Z"
  nice -n 10 $S/phototool/phototool $W/thumbs $W/batch/* >> $R
  rm -rf $W/batch $c; n=$((n+1)); echo "batch $n done, $(wc -l < $R) photos"
done
echo ALL DONE
