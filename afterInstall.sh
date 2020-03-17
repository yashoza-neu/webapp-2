#!/bin/bash
pwd
ls
cd /home/ubuntu/webapp
printenv
sudo chmod  -R 777 /home/ubuntu/webapp
sudo npm install
cd services
node createSchema.js