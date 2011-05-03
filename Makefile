
#===================================================================
#--------------------------- Variables -----------------------------
#===================================================================
src_files = lib/C.js
build_files = build/C.js
coffee = node_modules/.bin/coffee
express = node_modules/express/package.json

#-------------------------------------------------------------------
# BUILD
#------------------------------------------------------------------- 
ifneq (,$(findstring CYGWIN,$(shell uname -s)))
	requirejsBuild = ./support/requirejs/build/build.bat
else
	requirejsBuild = ./support/requirejs/build/build.sh
endif

#-------------------------------------------------------------------
# TEST
#------------------------------------------------------------------- 
ifndef TEST_BROWSER
	TEST_BROWSER := google-chrome
endif

ifndef TESTS
	TESTS := "**"
endif

ifdef TEST_DEBUG
	TEST_DEBUG_ = -d
endif


#===================================================================
#----------------------------- MACROS ------------------------------
#===================================================================


#===================================================================
#­--------------------------- TARGETS ------------------------------
#===================================================================
.PHONY : clean server

all: client/cells/bootstrap.js

#-------------------------------------------------------------------
# DEV 
#------------------------------------------------------------------- 
server:
	npm install xml2js-expat gzip knox

#-------------------------------------------------------------------
# BUILD
#------------------------------------------------------------------- 
client/cells/bootstrap.js: client/cells/C.js client/cells/C-pluginBuilder.js
	$(requirejsBuild) name=C!App out=client/cells/bootstrap.js baseUrl=client/cells includeRequire=true

#-------------------------------------------------------------------
# Dependencies 
#------------------------------------------------------------------- 
$(coffee):
	npm install coffee-script

$(express):
	npm install express

#-------------------------------------------------------------------
# TEST
#------------------------------------------------------------------- 

clean: 
	@@rm client/cells/bootstrap.*

