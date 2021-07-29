# verifyApostille

a [Sails](http://sailsjs.org) application

## Install

- You will need access to the .env file usually kept in keyspace but if not ask someone form Kainos
- Install dependencies with `npm install`
- Then run `npm start`
- Navigate to localhost:1337 in your browser

## Setup DB
Open the PSQL command line
```
psql -h localhost -p 5432 -U postgres
```
You'll be asked for the password for the postgres user; you can get this from the .env file for loi-application-service.

In the PSQL command line:
```
CREATE DATABASE "VerifyApostille";
```
Then type \q to exit to your shell, and enter:
```
psql -h localhost -p 5432 -U postgres -W -d VerifyApostille < ./databases/VerifyApostille.sql
```