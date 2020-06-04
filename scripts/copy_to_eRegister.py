#!/usr/bin/env python
import psycopg2
import sys
import pprint
import csv
import re
import os
from shutil import copyfile
import datetime
import logging
import unittest
import fileinput

PASSWORDFILE='/home/fcoloi/testing/verifyapostille/dataMigration/scripts/config/DBconfig.txt'
PATH='/home/fcoloi/testing/verifyapostille/dataMigration/data/'

#---------------------------------------------------------------------------------------------------                                                                         
#This function takes in a password file name
#This function returns the parameters necessary to form a connection to a postgres DB namely the variables: host, port, dbname, user, password
def setDBparameters(DBpasswordfile):
    f=open(DBpasswordfile, 'r')
    pfile=f.read()
    lines=pfile.split('\n')
    host=''
    port=''
    dbname=''
    user=''
    password=''
    for line in lines:
        keyvalue=line.split('=')
        if (keyvalue[0] == 'HOST'):
            host=keyvalue[1]
        elif(keyvalue[0] == 'PORT'):
            port=keyvalue[1]
        elif(keyvalue[0] == 'DBNAME'):
            dbname=keyvalue[1]
        elif(keyvalue[0] == 'USER'):
            user=keyvalue[1]
        elif(keyvalue[0] == 'PASSWORD'):
            password=keyvalue[1]
    return (host, port, dbname, user, password)

#---------------------------------------------------------------------------------------------------
#This function takes in the file name to a passwordfile
#This function returns a cursor and connection to database specified in the password file
def connectToDB(DBpasswordfile):
    #Set database parameters
    (host, port, dbname, user, password)=setDBparameters(DBpasswordfile)
    #Connect to the database and get a cursor object to perform queries
    conn_string = "host="+host+" port="+port+" dbname="+dbname+" user="+user+" password="+password
    print ("Connecting to database\n    ->"+"host="+host+" port="+port+" dbname="+dbname+" user="+user)
    # get a connection, if a connect cannot be made an exception will be raised here
    try:
        conn = psycopg2.connect(conn_string)
    except ValueError:
        logging.critical("Unable to connect to database\n    ->"+"host="+host+" port="+port+" dbname                                                                                                  ="+dbname+" user="+user)
    # conn.cursor will return a cursor object, you can use this cursor to perform queries
    cursor = conn.cursor()
    return (cursor, conn)

#------------------------------------------------------------------------------
#MAIN FUNCTION
def main():
    (cursor, conn)=connectToDB(PASSWORDFILE)
    query="COPY apostille(apostillenumber, dateissued, signatory, capacity, issuedby, seal, createddate, updateddate) FROM '" +PATH+"Apostille.csv' DELIMITER ',' CSV HEADER;"
    cursor.execute(query)
    conn.commit()

    query="COPY apostillestaging(apostillenumber, dateissued, signatory, capacity, issuedby, seal)  FROM '"+PATH+"ApostilleStaging.csv' DELIMITER ',' CSV HEADER;"
    cursor.execute(query)
    conn.commit()

    query="COPY country(countrycode, countryname) FROM '"+PATH+"Country.csv' DELIMITER ',' CSV HEADER;"
    cursor.execute(query)
    conn.commit()

    query="COPY geoipcountrywhois(ipaddressstart, ipaddressend, ipnumberstart, ipnumberend, countrycode, countryname)  FROM '"+PATH+"GeoIPCountryWhois.csv' DELIMITER ',' CSV HEADER;"
    cursor.execute(query)
    conn.commit()

    query="COPY logresulttype(resultid, resultname) FROM '"+PATH+"LogResultType.csv' DELIMITER ',' CSV HEADER;"
    cursor.execute(query)
    conn.commit()

    query="COPY sourcelocation(locationid, ipaddressstart, ipaddressend, ipnumberstart, ipnumberend, countrycode) FROM '"+PATH+"SourceLocation.csv' DELIMITER ',' CSV HEADER;"
    cursor.execute(query)
    conn.commit()

    query="COPY validationlog(logid, validationstartdate, validationenddate, apostillenumber, apostilledate, resultid, source, printed, browser) FROM '"+PATH+"ValidationLog.csv' DELIMITER ',' CSV HEADER;"
    cursor.execute(query)
    conn.commit()

    query='INSERT INTO "VerifyApostille" ("ApostilleNumber", "DateIssued", "SignedBy", "ActingCapacityOf", "BearsStampSeal", "IssuedBy", "DateCreated", "DateUpdated") Select apostillenumber, dateissued, signatory, capacity, seal, issuedby, createddate, updateddate from apostille;'
    cursor.execute(query)
    conn.commit()
#---------------------------------------------------------------------------------------------------                                                                         
#Call the main function
if __name__ == '__main__':
    main()

