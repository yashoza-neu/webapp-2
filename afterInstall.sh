#!/bin/bash
pwd
whoami
aws configure set default.region us-east-1
aws configure list
ls
#sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -c file:/home/centos/cloudwatch-config.json -s
#cd /home/centos/webapp
#sudo npm install