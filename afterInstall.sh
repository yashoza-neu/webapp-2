#!/bin/bash
pwd
aws configure set default.region us-east-1
aws configure list
ls
cd /home/ubuntu/webapp
sudo printenv
sudo npm install
cd services
node createSchema.js
cd ../
sudo npm start