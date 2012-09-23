#!/bin/bash
#Run gunicorn
PID_FILE=/var/run/gunicorn_guildwars2viz
WORKERS=1
BIND_ADDRESS=127.0.0.1:7090
WORKER_CLASS=gevent
LOGFILE=/var/log/gunicorn/guildwars2viz.log

cd /home/erik/Code/GuildWars2Viz
source /home/erik/Code/GuildWars2Viz/env/bin/activate

gunicorn app:app --pid=$PID_FILE --debug --log-level=debug --workers=$WORKERS --error-logfile=$LOGFILE --bind=$BIND_ADDRESS --worker-class=$WORKER_CLASS
