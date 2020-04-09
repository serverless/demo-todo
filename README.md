# Serverless Demo Application: Todo

This is a demo application to showcase several amazing features in the Serverless Framework Pro
dashbaord. Specifically, we showcase:

* Monolambda support
  * Routes/paths are autodetected from frameworks like Express, Flask and Lambda-API
* Tagging
  * Some invocations are tagged and supply an custom object which you can examine in the explorer
* Spans
  * The application stores/retrieves data from DynamoDB, randomly we grab the wikipedia page as well to showcase HTTP spans
* Errors
  * The application randomly throws errors
* Logging
  * Console.log is used in a few places to showcase the dashboards excellent logging support
* Deployments
  * The application updates itself and commits its changes to Github every 9 hours (check out the diffs in the serverless.yml for each deploy!)
    Serverless Framework Pro's Deployment Engine provides CI/CD and deploys the application after a git commit to different branches
* Layers
  * We use a lambda layer to add the `git` binary to our deployer function
* HTTP and Schedule events
  * Functions are invoked by HTTP via API Gateway (REST Api) and via a cron scheduler
* Parameters
  * The application stores the Github secret access token in Serverless Framework Pro's Parameters store

### Implementation details

- This application is deployed via CI/CD (see the `demo-todo` app under the Serverlessteam dashboard)
- The Github access token is from Kaz's personal github account
