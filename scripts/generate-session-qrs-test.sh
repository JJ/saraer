#!/bin/sh

# This script generates QR codes for the sessions and talks in an event
# You will need to install qrencode (brew install qrencode or apt-get install qrencode)

# Usage: ./generate-session-qrs.sh <url-prefix> [number-of-sessions]  [talks-per-session] [output-dir]

# Example: ./generate-session-qrs.sh https://www.devfest2018.gdgnantes.com 3 3 /tmp/qrs

# The script will generate 3 sessions with 3 talks each, and output the QR codes in /tmp/qrs

prefix=${1:-"https://databeers-tickets.deno.dev/ticket/"}
talks=${2:-4}
output=${3:-'/tmp/'}

echo $prefix $sessions $talks $output


  for j in $(seq 1 $talks); do
    qrencode -s 24 -o $output/session-0-talk-$j.png "$prefix/$i/$j"
  done

