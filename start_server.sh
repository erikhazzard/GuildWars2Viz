#!/bin/bash

echo "Activating virtual environment"
. env/bin/activate

# start server
python app.py
