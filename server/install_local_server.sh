#!/bin/bash
# All python requirements are installed into a virtual environment

echo "Installing virtual env"
sudo easy_install virtualenv

echo "Creating and activate virtual environment"
virtualenv --no-site-packages env
. env/bin/activate

echo "Installing requirements"
pip install -r server/python_requirements.txt
