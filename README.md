# IRIS
A monitoring suite that provides insights on health metrics of your Kafka broker
<p align="center">
<img src= "https://user-images.githubusercontent.com/102982879/183760543-c2fa9913-f227-471c-8928-672973ad63d8.png" width="300" height="300" align="center">
</p>

# Overview

Kafka event streams broker sensitive information with high data throughput and therefore must to be highly resilient to failure. 
Clusters require health monitoring to better inform manual partitioning, broker replication and other intricate Kafka maintenance processes. 
This ensures Kafka brokers do not throttle user experience and maintain fault tolerance.


## Setting up your environment

If you are running your Kafka broker in the native Java environment...

1) Install JAVA: https://www.oracle.com/java/technologies/downloads/#jdk18-mac 

   - Only for testing Kafka on local terminal purposes
   - Follow the Quick Start Guide provided by Apache Kafka if you choose to run broker in the native Java environment (https://kafka.apache.org/quickstart).
   - You will need to configure the ```docker-compose.yml``` to listen on the correct Kafka ports to access the ```JMX attributes```.

If you are running your Kafka broker in a Docker environment

2) Install Docker: https://docs.docker.com/get-docker/

3) Fork the project from the ```main``` branch

4) Run ```npm install```

5) Open Docker and check Images tab, it should include the following Docker images to run the container environments. If not, please install the latest images using the ```docker pull``` command.
<img width="1270" alt="image" src="https://user-images.githubusercontent.com/102982879/183763901-94dcec89-b7d8-4799-9686-b972782edf9c.png"  width="#00" height="#00">


6) Once Docker has been booted up, run the ```docker-compose.yml``` file in your terminal using the ```docker-compose up``` command. 

    - Watch your terminal. If at any point you receive this error, close your Docker and terminal and rerun again. Use Docker Desktop to monitor the JMX container logs for any errors you may miss in your terminal.
   <img src = "https://user-images.githubusercontent.com/102982879/183760177-7ae42fa9-02f7-46c6-8059-ad729448eccd.png">

7) In another terminal, run ```npm run dev``` to start the monitor.

## Viewing the Metric

1) After running ```npm run dev```, the application will load onto ```localhost:8080``` where you can browse your incoming metrics. 
    - On the left pane, there are persistent histogram and piecharts.
    - On the right pane, you can add line charts with different metrics.

2) Click on ```Metric``` and ```Time Frame``` dropdowns to monitor different Kafka Metrics on different Time Frames.

<img src= "https://user-images.githubusercontent.com/102982879/184166185-ab7e1b27-c273-4ecd-be4f-67eaa348d821.gif" width="#00" height="300">

3) Click on ```+``` button in the upper right hand corner to add additional line charts

4) Click on ```X``` button on each line chart container to delete each chart

## Changing Ports

1) On load, the default PORT is ```localhost:9090```

2) Click on ```ROOT ACCESSS``` on the Navigation Bar to switch to a different port

    - Port numbers and passwords are hard coded into the MongoDB.

    - If you'd like to add additional port number and passwords, use Postman to make a ```POST``` request to ```'/createPort'``` with keys ```port``` and ```password``` in the ```request body```. 

    - You should receive a positive response of the MongoDB document with the newly created ```port``` and hashed ```password``` in the response. 
    
    - If you receive a ```null``` response, the ```port``` already exists in the database.

## Other localhost:

1) To view list of raw JMX metrics and data : ```localhost:5556/metrics```

2) To view Prometheus : ```localhost:9090```

3) To view a list of available metrics: ```http://localhost:9090/api/v1/label/__name__/values```

4) In order to query different Prometheus end point, follow the syntax : ```http://localhost:9090/api/v1/query?query={Enter the Metric Name}[{TimeRange}].```

- For example: ```http://localhost:9090/api/v1/query?query=kafka_server_broker_topic_metrics_messagesinpersec_rate[1h]```

## Using the provided demo

We provide an end to end Kafka producer and consumer to measure the stability of the Iris health monitor. The ```Producer``` and ```Consumer``` files contain simple message files streamed to the Kafka Broker using ```AVRO``` schema and ```KafkaJS```. 

- In one terminal, run the command ```npm run start:producer```. It should show:

  <img width="482" alt="image" src="https://user-images.githubusercontent.com/102982879/183764487-57fdc27c-080a-4669-bc5c-ba6d99c2ec94.png">

- In a separate terminal, run ```npm run start:consumer```. It should show:

  <img width="371" alt="image" src="https://user-images.githubusercontent.com/102982879/183764560-3dd0e3bf-32c6-4b7d-aef9-6ef30a777571.png">

## Authors

- Brennan Lee
  - https://www.linkedin.com/in/brennan-lee/ 
  - https://github.com/blee3395
  
- Michael Reyes
  - https://github.com/Michaelr499
  - https://www.linkedin.com/in/michael-reyes-b4319216b/

- Walter Li

- Huu (John) Le
  - https://www.linkedin.com/in/huu-le/
  - https://github.com/JohnLeGit
