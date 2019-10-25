# Docker environment with Node-RED, Zeebe and Operate

This directory contains a profile to run a Node-RED instance, a single Zeebe broker and an instance of Camunda Operate.

The components that will be started with this profile:

-   Node-RED
-   Zeebe broker
-   Camunda Operate
-   Elastic Search

## Setup

### Prerequisites

-   [Install Docker](https://docs.docker.com/compose/install/)

### Preparation

-   Clone this repository:

```bash
git clone https://github.com/pedesen/node-red-contrib-zeebe
```

### Start the containers

-   Change into this directory:

```bash
cd resources/docker
```

-   Start the profile:

```bash
docker-compose up
```

## How to use

-   Navigate to http://localhost:1880 to access Node-RED
-   Navigate to http://localhost:8080 to access Operate

TODO: describe what's possible

## Clean up

### Stop and remove the containers

-   Press `Ctrl-C` to stop the containers.

-   Destroy the stopped containers:

```bash
docker-compose down
```

### Remove persistent data

The `docker-compose.yml` file specifies persistent volumes for both Zeebe and Camunda Operate. This means that between executions your data is persisted. You may wish to remove all data to start from nothing. To do this, you need to delete the persistent volumes.

To delete all persistent data:

-   Stop and remove the containers.

-   Run the following command:

```bash
docker volume rm operate_zeebe_data
docker volume rm operate_zeebe_elasticsearch_data
```
