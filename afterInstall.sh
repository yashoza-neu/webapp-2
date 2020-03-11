#!/bin/bash
pwd
ls
cd /home/ubuntu/webapp
sudo printenv
sudo npm install
cd services
node createSchema.js