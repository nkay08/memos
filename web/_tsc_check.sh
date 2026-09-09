#!/bin/bash
cd /home/deck/git/memos/web
npx tsc --noEmit > /tmp/tsc_out.txt 2>&1
echo "done $?"
