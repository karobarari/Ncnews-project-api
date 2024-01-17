q  1# Northcoders News API



in order to connect provided Databases you need to create <.env.test> file in for your test environment and <.env.development> for your development environment.

Currently running on NODE 18 & PSQL 14

Welcome to my Northcoders Backend Project!

To follow along with me, you will need to do a few things before getting started.

Go to my online repository and create your own fork: https://github.com/karobarari/Ncnews-project-api

Then, navigate to your local directory and clone your newly created repo by using the command below.

git clone <your-repo-name.git>

Navigate into your newly cloned repo and use code . to launch VSCode.

Run "npm i" in your terminal to install all the necessary dependencies (make sure to navigate into your newly cloned folder before running this command!)

You will also have to create two .env files(.env.test & .env.development), one for test purposes, and one for development purposes.

.env.development ======> PGDATABASE=nc_news
.env.test =====> PGDATABASE=nc_news_test

Make sure you read through the files and data to introduce yourself to the project and understand the relationships between our data tables in psql.

Run the scripts included in the package.json to get up and running, in the following order:

npm run setup-dbs

npm run seed

npm run prepare

npm test

Once you are happy that everything is setup correctly and all tests are passing, you can now seed the online database by changing the .env.production file to your own DATABASE_URL and host the seed to your databse by using the command NODE_ENV=production npm run seed-prod.

Thank you for following along with me and have fun!
