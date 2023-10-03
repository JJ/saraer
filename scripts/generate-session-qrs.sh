#!/bin/sh

# This script generates QR codes for the sessions and talks in an event
# You will need to install qrencode (brew install qrencode or apt-get install qrencode)

# Usage: ./generate-session-qrs.sh <url-prefix> [number-of-sessions]  [talks-per-session] [output-dir]

# Example: ./generate-session-qrs.sh https://www.devfest2018.gdgnantes.com 3 3 /tmp/qrs

# The script will generate 3 sessions with 3 talks each, and output the QR codes in /tmp/qrs

prefix=${1:-"http://localhost:8080"}
sessions=${2:-1}
talks=${3:-8}
output=${4:-'/tmp/qrs'}

echo $prefix $sessions $talks $output

for i in $(seq 1 $sessions); do
  for j in $(seq 1 $talks); do
    qrencode -s 24 -o $output/session-$i-talk-$j.png "$prefix/$i/$j"
  done
done
