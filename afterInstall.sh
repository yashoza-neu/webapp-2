#!/bin/bash
pwd
ls
cd /home/ubuntu/webapp
printenv
sudo npm install
cd services
node createSchema.js