# Guildwars 2 Visualization
Interactive data visualization of guild wars 2 gender, races, professions, and tradeskill choices. Uses D3 and SVG filters.

## Dependencies (For running server locally)
Python
(Optional) - Node, NPM ( Node package manager - http://npmjs.org/ ) - used to compile Less and minify JS
Coffeescript (to compile to JS)

Note: All static files are linked to index.html, so a server / build process is not required if you just wish to view the page locally

# Running Locally
-----------------------------------------
Requirements: Python and PIP 
Included in this repo are the built files, so to get up and running simply make the files accessible via a server. 
A virtualenvironment and dependencies via PIP are included.  
(If you do not have PIP installed, use `sudo easy_install pip`

Setup the local server (sets up virtualenv and flask and other dependencies)
* To setup PIP, 
		`sudo easy_install pip`
		or (if using debian based distro)
		`apt-get install python-pip`
		or (from source) 
		http://pypi.python.org/pypi/pip#downloads	

* Setup python requirements (will install Flask (simple HTTP server and pymongo (used to talk with mongo))
	`./server/install_local_server.sh`
		(Run as sudo if permissions are problematic. Run from this project's folder)

* Run the server
	./start_server.sh

* The site can be accessed via port 1337; go to http://localhost:1337


### Building (OPTIONAL)
If you'd like to build the source, [NodeJS](http://nodejs.org) and [npm](http://npmjs.org/) is used.
Note - this step is optional, as the CSS and JS files are included 
The dependencies for Node are listed in package.json. To build:
* Install NodeJS
* Install NPM
* In this project's directory, run `npm install -d`
* Make the third party files in this project's directory, run `make third`
* Make everything, run `make`
* All done

# Usage Information
-----------------------------------------
###Editing CSS
Style files are written in [LESS](http://lesscss.org/).  To modify a CSS property:
    * Edit the corresponding .less file in static/less
    * Execute make: `make less` (Note: this requires Node and Less to be installed)

# Coffeescript
-----------------------------------------
Note: This project is written using Coffeescript. To compile .coffee files to .js, you can run `make` after following the building steps outlined above
    * (Requires the coffee binary and uglifiy JS compiler)
