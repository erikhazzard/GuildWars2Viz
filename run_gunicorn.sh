#!/bin/bash
#Run gunicorn
PID_FILE=/var/run/gunicorn_deckviz.pid
WORKERS=1
BIND_ADDRESS=127.0.0.1:8002
WORKER_CLASS=gevent
LOGFILE=/var/log/gunicorn/deckviz.log

cd /home/erik/Code/DeckViz
source /home/erik/Code/DeckViz/env/bin/activate

gunicorn app:app --pid=$PID_FILE --debug --log-level=debug --workers=$WORKERS --error-logfile=$LOGFILE --bind=$BIND_ADDRESS --worker-class=$WORKER_CLASS
