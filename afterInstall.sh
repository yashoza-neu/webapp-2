#!/bin/bash
pwd
ls
cd /home/ubuntu/webapp
printenv
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -c file:/home/ubuntu/cloudwatch-config.json -s
sudo chmod  -R 777 /home/ubuntu/webapp
sudo npm install
cd services
node createSchema.js