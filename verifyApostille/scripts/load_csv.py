#fcoloi@FCO-LOI-INT-TEST:~/testing/verifyapostille/csv/scripts$ cat load_csv.py
#!/usr/bin/env python

# -----------------------------------------------------------------------
# IMportANT: THIS HEADER MUST NOT BE REMOVED FROM THIS SOFTWARE UNDER ANY CIRCUMSTANCES.
# -----------------------------------------------------------------------
# This software is licensed by Informed Solutions and not sold. You may only use this
# software subject to you or your organisation holding a valid licence ("The Licence"),
# and any such use is strictly subject to the provisions of The Licence. For the
# avoidance of doubt and unless expressly agreed otherwise as part of The Licence,
# Informed Solutions retains all ownership, copyright and intellectual property rights
# to this software, which are protected by law, applicable international treaties and
# conventions regarding intellectual property rights including trade secrets.
# Unless expressly permitted by The Licence, you and your organisation may not:
# (1) Copy, translate, reverse engineer, de-compile, disassemble adjust or modify
    # the software.
# (2) Remove any proprietary notices or other markings (such as this notice) embodied
    # in the software.
# (3) Sell, rent, lease, sub-lease, lend, assign, re-distribute, time-share or transfer
    # the software to a third party, or use this software to provide a service bureau
    # or commercial application service to any third party.
# (4) Carry out or facilitate any act where the design, intent or result of the act is
    # to circumvent The Licence, or measures within the software to monitor use of this
    # software in accordance with The Licence.
# Also note that:
# (1) Any enhancements, patches, fixes or upgrades provided subsequently by Informed
    # Solutions for this software are subject to the same Licence.
# (2) Where you are given access to this software in accordance with the terms of The
    # Licence, you are also responsible for ensuring that your use of the software is
    # in accordance with the terms of The Licence, in addition to any responsibilities
    # of your organisation.
# Use of this software by you and your organisation signifies acceptance of these
# terms as well as any separate licence that applies to this software.
# -----------------------------------------------------------------------
# Copyright   :   (c) Informed Solutions 2016.  All rights reserved.
# -----------------------------------------------------------------------

#This program takes in the following arguments:
    #1. loggingDir - path to the directory where the log files are stored
    #2. transferDir - path to the directory where the CSV file transferred from Iizuka's CaseBook Management System is separate
    #3. workDir - path to the directory where CSV file is temporarily copied to in order to import
    #4. archiveDir - path to the directory where CSV file is stored permanently
    #5. passwordfile -contains connection information for postgres database.
    #6. logLevel - An integer representing the level to which logging is required. Ranges from 0 (meaning all logs captured) to 50 (only CRITICAL logs captured)

#Need to install psycopg2 before importing it
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

#--------------------------------------------------------------------------------------------------------------------
#This function takes in a CSV file
#This function then validates the CSV (by checking the number of rows, if the CSV contains duplicates, correct number of fields)
#If the CSV file is in the right format the function returns a True and a list containing the records from the CSV file
#If the CSV file is not in the right format the function returns False and an empty list
def validateCSV(workcsv):
    newReader=[]
    CSVvalid=True
    with open(workcsv, 'rU') as f:
        #Initialise local variables
        seen=set()
        reader=csv.reader(f, delimiter=',', quotechar='"')
        counter=0
        actual_num_apostilles=0
        expected_num_apostilles=0
        for row in reader:
            #Ignore empty lines
            if row:
                #If the row is the header row (counter == 0) then define the expected number of Apostilles
                if (counter == 0):
                    expected_num_apostilles=row[1]
                    try:
                        int(expected_num_apostilles)
                    except ValueError:
                        logging.critical("CSV file does not contain header in correct format. Expecting number of Apostilles in column 2 row 0 instead received: "+  expected_num_apostilles)
                        CSVvalid=False
                        break
                #If the row not the header row then validate:
                #1. Check the number of fields in each row is correct
                #2. That the Apostille number and Date issued has not been seen before (i.e. the Apostille in not duplicated)
                #3. Check the Apostille valid field contains either true or false
                else:
                    #Check number of fields
                    if (len(row) != 9):
                        logging.critical("Incorrect number of fields in row: "+ str(counter) +"row contains: "+','.join('"'+ str(e)+'"' for e in row))
                        CSVvalid=False
                        break
                    ApostilleNumber = row[0]
                    DateIssued = row[1]
                    key=ApostilleNumber+", "+DateIssued
                    #Check for duplicates
                    if key in seen:
                        logging.critical("The CSV file is invalid as it contains duplicate Apostilles.")
                        CSVvalid=False
                        break
                    else:
                        seen.add(key)
                    #Check that ApostilleValid field is in the right format
                    ApostilleValid = row [8]
                    if (isinstance(ApostilleValid, basestring)):
                        if (ApostilleValid.upper() != "TRUE" and ApostilleValid.upper() != "FALSE"):
                            logging.critical("The 9th column, ApostilleValid, should contain a value of TRUE or FALSE. Instead this field contains: "+ApostilleValid)
                            CSVvalid=False
                            break
                    #append all rows to newReader (not including the header row)
                    newReader.append(row)
                counter=counter+1
        #Remove header row from count
        actual_num_apostilles=counter-1
        if(CSVvalid and int(expected_num_apostilles)!=actual_num_apostilles):
            logging.critical("CSV file has an incorrect number of records. The expected number of records is: "+ expected_num_apostilles + ", the number of actual records in the file is: " + str(actual_num_apostilles))
            CSVvalid=False

    if CSVvalid:
        logging.debug("The CSV contains the correct number of Apostilles, contains no duplicates and has the correct number of fields")
    return (CSVvalid, newReader)


#--------------------------------------------------------------------------------------------------------------------
#This function takes in an Apostille number and the date it was issued
#This function returns true if the Apostille defined in the input is in the database
#This function returns false otherwise
def ApostilleInDB (ApostilleNumber, DateIssued, cursor):
    query_select="Select * from \"VerifyApostille\" where \"ApostilleNumber\"='"+ApostilleNumber+"' and \"DateIssued\"='" +DateIssued + "'"
    try:
        cursor.execute(query_select)
        if cursor.fetchone():
            return True
    except psycopg2.Error as e:
        logging.error("It was not possible to perform a select with the ApostilleNumber and DateIssued of the current record: ApostilleNumber: "+ ApostilleNumber + "DateIssued: " + DateIssued + "The following error was recorded."+str(e))
    return False


#--------------------------------------------------------------------------------------------------------------------
#This function takes in a file name and an array containing Apostille record information
#This record appends the record information to file
def appendFailedRecordsToFile(frecordfile, recordstr):
    with open(frecordfile, "a") as frec:
        frec.write(recordstr+'\n')


#--------------------------------------------------------------------------------------------------------------------
#This function takes in a cursor and connection to a DB as well as a dictionary and string
#This function updates a record in the database
def updateRecord (cursor, conn, ApostilleDict, recordstr):
    update_query="UPDATE \"VerifyApostille\" SET \"SignedBy\"='" + ApostilleDict['SignedBy'] + "', \"ActingCapacityOf\"='"+ ApostilleDict['ActingCapacityOf'] + "', \"BearsStampSeal\"='" + ApostilleDict['BearsStampSeal'] + "', \"IssuedBy\"='"+ ApostilleDict['IssuedBy'] + "', \"DateApostilleCreated\"='"+ ApostilleDict['DateApostilleCreated'] + "', \"DateApostilleUpdated\"='" + ApostilleDict['DateApostilleUpdated'] +"', \"DateUpdated\"=now() where \"ApostilleNumber\"='" + ApostilleDict['ApostilleNumber'] + "' and \"DateIssued\"='" + ApostilleDict['DateIssued'] +"'"
    try:
        cursor.execute(update_query)
        conn.commit()
        logging.info("Updated "+recordstr)
    except psycopg2.Error as e:
        conn.rollback()
        logging.error("The follwoing record is not able to be updated: \n"+ recordstr +"\nThe following error was recorded."+str(e))

#--------------------------------------------------------------------------------------------------------------------
#This function takes in a cursor and connection to a DB as well as a dictionary and string
#This function inserts record
def insertRecord (cursor, conn, ApostilleDict, recordstr):
    insert_query="Insert into \"VerifyApostille\" (\"ApostilleNumber\", \"DateIssued\", \"SignedBy\", \"ActingCapacityOf\", \"BearsStampSeal\", \"IssuedBy\", \"DateApostilleCreated\", \"DateApostilleUpdated\" ) Values ('" + ApostilleDict['ApostilleNumber'] +"', '" + ApostilleDict['DateIssued'] + "', '" + ApostilleDict['SignedBy']+ "', '" + ApostilleDict['ActingCapacityOf']+ "', '" + ApostilleDict['BearsStampSeal']+ "', '" + ApostilleDict['IssuedBy']+ "', '" + ApostilleDict['DateApostilleCreated']+ "', '" + ApostilleDict['DateApostilleUpdated']+ "')"
    try:
        cursor.execute(insert_query)
        conn.commit()
        logging.info("Inserted "+recordstr)
    except psycopg2.Error as e:
        conn.rollback()
        logging.error("The follwoing record is not able to be inserted: \n"+ recordstr +"\nThe following error was recorded."+str(e))

#--------------------------------------------------------------------------------------------------------------------
#This function takes in a cursor and connection to a DB as well as a dictionary and string
#This function deletes a record
def deleteRecord (cursor, conn, ApostilleDict, recordstr):
    delete_query="Delete from \"VerifyApostille\" where \"ApostilleNumber\"='" + ApostilleDict['ApostilleNumber'] + "' and \"DateIssued\"='" + ApostilleDict['DateIssued'] +"'"
    try:
        cursor.execute(delete_query)
        conn.commit()
        logging.info("Deleted "+recordstr)
    except psycopg2.Error as e:
        conn.rollback()
        logging.error("The follwoing record is not able to be deleted: \n"+ recordstr +"\nThe following error was recorded."+str(e))

#--------------------------------------------------------------------------------------------------------------------
#This function takes in an Apostille record array
#This function returns an Apostille dictionary
def initialiseApostilleDictionary(record):
    ApostilleDict = {
        'ApostilleNumber':record[0].decode('latin-1'),
        'DateIssued':record[1].decode('latin-1'),
        'SignedBy':record[2].decode('latin-1'),
        'ActingCapacityOf':record[3].decode('latin-1'),
        'IssuedBy':record[4].decode('latin-1'),
        'BearsStampSeal':record[5].decode('latin-1'),
        'DateApostilleCreated':record[6].decode('latin-1'),
        'DateApostilleUpdated':record[7].decode('latin-1'),
        'ApostilleValid':record[8].decode('latin-1')}
    return ApostilleDict

#--------------------------------------------------------------------------------------------------------------------
#This function uses command-line variables to initialise file locations and other variables
#This function exits the program if too few command-line variables are detected
def initialiseVariables():
    if (len(sys.argv) > 6):
        loggingDir=sys.argv[1]
        transferDir=sys.argv[2]
        workDir=sys.argv[3]
        archiveDir=sys.argv[4]
        DBpasswordfile=sys.argv[5]
        logLevel=sys.argv[6]

        #Define the process id file name
        pidfile=workDir+"pid_lock.txt"
        #Get the process id
        pid=str(os.getpid())
        #The CSV file transferred from CaseBook to upload into DB
        csvfile=transferDir+"apostille_update.csv"
        #The work copy of the CSV file
        workcsv=workDir+"apostille_update.csv"
        #The current datetime
        now = datetime.datetime.now()
        #The archived CSV file for manual debugging and reference usage
        archivecsv = archiveDir+"apostille_update_"+str(now)+".csv"
        #Log file which contains errors and information (depending on the logging level set
        logfile=loggingDir+"/"+str(now)+"_log.txt"
        #The file that records that fail to insert, update or delete are sent to
        return (pidfile, pid, csvfile, workcsv, archivecsv, logfile, DBpasswordfile, logLevel)
    else:
        print "Incorrect number of arguments. Expecting the following arguments: loggingDir transferDir workDir archiveDir failedDir DBpasswordfile logLevel"
        #Stop the program
        sys.exit(0)

#--------------------------------------------------------------------------------------------------------------------
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

#--------------------------------------------------------------------------------------------------------------------
#This function takes in the file name to a passwordfile
#This function returns a cursor and connection to database specified in the password file
def connectToDB(DBpasswordfile):
    #Set database parameters
    (host, port, dbname, user, password)=setDBparameters(DBpasswordfile)
    #Connect to the database and get a cursor object to perform queries
    conn_string = "host="+host+" port="+port+" dbname="+dbname+" user="+user+" password="+password
    logging.info("Connecting to database\n    ->"+"host="+host+" port="+port+" dbname="+dbname+" user="+user)
    # get a connection, if a connect cannot be made an exception will be raised here
    try:
        conn = psycopg2.connect(conn_string)
    except ValueError:
        logging.critical("Unable to connect to database\n    ->"+"host="+host+" port="+port+" dbname="+dbname+" user="+user)
    # conn.cursor will return a cursor object, you can use this cursor to perform queries
    cursor = conn.cursor()
    return (cursor, conn)

#------------------------------------------------------------------------------
#MAIN FUNCTION
def main():

    #Initialise variables
    (pidfile, pid, csvfile, workcsv, archivecsv, logfile, DBpasswordfile, logLevel)=initialiseVariables()
    #Initialise the log file
    logging.basicConfig(filename=logfile, level=int(logLevel))
    #Check process id file does not exist
    if not os.path.isfile(pidfile):
        file(pidfile, 'w').write(pid)
        #Check CSV has been transferred from Iizuka's CaseBook Management System and is in the expected folder
        if os.path.isfile(csvfile):
            #Check that the CSV file is not in the work directory
            if not os.path.isfile(workcsv):
                #Move CSV from the trasnfer folder to work directory and create backup in the archive folder
                os.rename(csvfile, workcsv)
                copyfile(workcsv, archivecsv)
                #Check that the CSV has a valid number of records and fields, and does not contain any duplicated Apostilles
                (CSVvalid, CSVrecords)=validateCSV(workcsv)
                #print (len(list(CSVrecords)))
                if (CSVvalid):
                    #Connect to the database and get a cursor object to perform queries
                    (cursor, conn)=connectToDB(DBpasswordfile)
                    #Loop through Apostille records in file
                    for record in CSVrecords:
                        #Map fields in DB to fields in CSV file. Please refer to data dictionary for specification
                        ApostilleDict = initialiseApostilleDictionary(record)
                        #Check if an Apostille is valid (that is not void)
                        IsApostilleValid=(ApostilleDict['ApostilleValid'].upper()=='TRUE')
                        #Turn record into string for logging
                        recordstr=','.join('"'+ str(e)+'"' for e in record)
                        #Check if Apostille is in the postgres DB
                        IsApostilleInDB=ApostilleInDB (ApostilleDict['ApostilleNumber'], ApostilleDict['DateIssued'], cursor)
                        #If Apostille is valid and already in database then update record
                        if(IsApostilleValid and IsApostilleInDB):
                            updateRecord (cursor, conn, ApostilleDict, recordstr)
                        #If Apostille is valid but not in the DB then insert
                        elif(IsApostilleValid and not IsApostilleInDB):
                            insertRecord (cursor, conn, ApostilleDict, recordstr)
                        #If Apostille not valid and record is in the DB then delete record
                        elif(not IsApostilleValid and IsApostilleInDB):
                            deleteRecord (cursor, conn, ApostilleDict, recordstr)
                        #If Apostille is not valid and is not in the DB then log information about record.
                        elif(not IsApostilleValid and not IsApostilleInDB):
                            logging.info("The following Apostille is void and is not found in the DB: "+recordstr)
                    cursor.close()
                    conn.close()
                #Remove work csv from work directory
                os.remove(workcsv)
                #FOR TESTING PURPOSES ONLY. PLEASE REMOVE AFTER TESTING COMPLETE
                #os.rename(archivecsv, csvfile)
            else:
                logging.critical("The following CSV is already within the work directory: "+workcsv+"\nPlease remove this file and try again")
        else:
            logging.critical("The expected CSV is not in the folder specified. The file we were expect was:"+csvfile)
        os.remove(pidfile)
    else:
        logging.critical("The last process did not complete correctly. Please wait until process is complete or remove the following file: "+pidfile+" and try again")

#--------------------------------------------------------------------------------------------------------------------
#Call the main function
if __name__ == '__main__':
    main()
