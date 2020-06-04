#!/bin/bash

LOGGINGDIR="/home/fcoloi/testing/verifyapostille/csv/scripts/logs/"
TRANSFERDIR="/home/fcoloi/testing/verifyapostille/csv/scripts/transfer/"
WORKDIR="/home/fcoloi/testing/verifyapostille/csv/scripts/workdir/"
ARCHIVEDIR="/home/fcoloi/testing/verifyapostille/csv/scripts/workdir/archive/"
PASSWORDFILE="/home/fcoloi/testing/verifyapostille/csv/scripts/config/DBconfig.txt"
SCRIPTDIR="./"

#LOGGING LEVELS
#DEBUG  Detailed information, typically of interest only when diagnosing problems.
#INFO   Confirmation that things are working as expected.
#WARNING        An indication that something unexpected happened, or indicative of some problem in the near future (e.g. .disk space low.). The software is still working as expected.
#ERROR  Due to a more serious problem, the software has not been able to perform some function.
#CRITICAL       A serious error, indicating that the program itself may be unable to continue running.

# Logging Level Numeric value
# CRITICAL      50
# ERROR 40
# WARNING       30
# INFO  20
# DEBUG 10
# NOTSET        0
DEFAULTLOGLEVEL=40

if [ "$1" != "" ]; then
    LOGLEVEL=$1
else
    LOGLEVEL=$DEFAULTLOGLEVEL
fi

#Run python script
${SCRIPTDIR}load_csv.py ${LOGGINGDIR} ${TRANSFERDIR} ${WORKDIR} ${ARCHIVEDIR} ${PASSWORDFILE} ${LOGLEVEL}

