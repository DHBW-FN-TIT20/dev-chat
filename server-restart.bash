#!/bin/bash

cd /home/jb/microSD/repos/dev-chat;
GITTOKEN01=$(cat /home/jb/gitTokens/token01.txt);
git pull https://johannesbrandenburger:$GITTOKEN01@github.com/DHBW-FN-TIT20/dev-chat;
pm2 delete dev-chat;
npm run build;
pm2 start "npm run start" --name "dev-chat";