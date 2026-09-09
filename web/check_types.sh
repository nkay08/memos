#!/bin/bash
cd /home/deck/git/memos/web
npx tsc --noEmit > /tmp/tsc_result.txt 2>&1
echo "exit: $?" >> /tmp/tsc_result.txt
