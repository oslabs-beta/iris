<p align="center">
<img src= "https://media.discordapp.net/attachments/1001284784078733404/1012010119787204678/IRIS_7.png" width="300" height="300" align="center">
</p>
<h2 align="center" style="font-size: 40px">Kafka Health Monitoring Suite</h2>
<p align="center">
  <img alt="GitHub" src="https://img.shields.io/badge/License-MIT-green.svg">
  <img alt="GitHub issues" src="https://img.shields.io/github/issues-raw/oslabs-beta/iris?color=yellow">
  <img alt="GitHub All Releases" src="https://img.shields.io/github/downloads/oslabs-beta/iris/total?color=green">
  <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/oslabs-beta/iris?color=orange">
  <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/oslabs-beta/iris?style=social">  

</p>

# Overview

Apache Kafka is an event-driven data streaming platform that stores and brokers sensitive information with high data throughput and fault tolerance. 
Broker clusters require health monitoring to better inform partitioning, replication, data persistence and other intricate Kafka maintenance processes. 
Iris offers a dynamic solution to observe your Kafka platform in real time, compare against historically logged data and ensures your broker does not throttle user experience.

# Setting up your environment

Iris provides a containerized Docker environment with a highly configurable Kafka container. Please see the ```docker-compose.yml``` if you wish to configure your broker. 

1) Install Docker: https://docs.docker.com/get-docker/

2) Fork the repo from the ```main``` branch

3) Run the command: ```npm install```

4) Open Docker and check Images tab, it should include the following Docker images to run the container environments. If not, please install the latest images using the ```docker pull``` command.

<img width="1270" alt="image" src="https://user-images.githubusercontent.com/102982879/183763901-94dcec89-b7d8-4799-9686-b972782edf9c.png"  width="#00" height="#00">


5) Once Docker has been booted up, run the ```docker-compose.yml``` file in your terminal using the ```docker-compose up``` command. 

    - Watch your terminal. If at any point you receive the following error, close your Docker environment in your terminal with ```CTRL+C``` and rerun ```docker-compose up``` again. Use Docker Desktop, and click on JMX-Kafka's logs to monitor the JMX container logs for any errors you may miss in your terminal.

   <img src = "https://user-images.githubusercontent.com/102982879/183760177-7ae42fa9-02f7-46c6-8059-ad729448eccd.png">

6) Now that the Kafka broker is running and the ports are being read properly, run your Kafka dependent program across the broker to begin streaming your data. 

7) In another terminal, run command ```npm run dev``` to start the application and begin viewing the broker's health.

# Viewing the Metric

1) After running ```npm run dev```, the application will load onto ```localhost:8080``` where you can browse your incoming metrics. 
    - On the left pane, there are persistent histograms and piecharts.
    - On the right pane, you can add line charts with different metrics.

2) Click on ```Metric``` and ```Time Frame``` dropdowns to monitor different Kafka Metrics on different Time Frames.

<img src= "https://media.discordapp.net/attachments/1001284784078733404/1012010351497322516/iris_demo.gif" width="#00" height="#00">

3) Click on ```+``` button in the upper right hand corner to add additional line charts.

4) Click on ```X``` button on each line chart container to delete each chart.

5) Click on ```clock``` button underneath ```+``` in the upper right hand corner to view historical data at a specific time interval. Data is logged on a 15 sec interval to an AWS RDS SQL database.

# Changing Ports

1) On load, the default PORT is ```localhost:9090```

2) Click on ```PORT ACCESSS``` on the Navigation Bar to switch to a different port

    - Port numbers and passwords are hard coded into a MongoDB database.

    - If you'd like to add additional port number and passwords, use Postman to make a ```POST``` request to ```'/createPort'``` with keys ```port``` and ```password``` in the ```request body```. 

    - You should receive a positive response of the MongoDB document with the newly created ```port``` and hashed ```password``` in the response. 
    
    - If you receive a ```null``` response, the ```port``` already exists in the database.

# Other accessible localhost ports

1) To view a list of raw JMX metrics and data : ```localhost:5556/metrics```

2) To view Prometheus : ```localhost:9090```

3) To view a list of available metrics: ```http://localhost:9090/api/v1/label/__name__/values```

4) In order to query different Prometheus end points, follow the syntax : ```http://localhost:9090/api/v1/query?query={Enter the Metric Name}[{TimeRange}].```

- For example: ```http://localhost:9090/api/v1/query?query=kafka_server_broker_topic_metrics_messagesinpersec_rate[1h]```

# Using the provided demo

We provide an end to end Kafka producer and consumer to measure the stability of the Iris health monitor. The ```Producer``` and ```Consumer``` files contain simple message files streamed to the Kafka Broker using ```AVRO``` schema and ```KafkaJS```. 

- In one terminal, run the command: ```npm run start:producer```. It should show:

  <img width="482" alt="image" src="https://user-images.githubusercontent.com/102982879/183764487-57fdc27c-080a-4669-bc5c-ba6d99c2ec94.png">

- In a separate terminal, run the command: ```npm run start:consumer```. It should show:

  <img width="371" alt="image" src="https://user-images.githubusercontent.com/102982879/183764560-3dd0e3bf-32c6-4b7d-aef9-6ef30a777571.png">

# Authors

- Brennan Lee
  - https://www.linkedin.com/in/brennan-lee/ 
  - https://github.com/blee3395
  
- Michael Reyes
  - https://github.com/Michaelr499
  - https://www.linkedin.com/in/michael-reyes-b4319216b/

- Walter Li
  - https://github.com/findwalle
  - https://www.linkedin.com/in/li-walter/

- Huu (John) Le
  - https://www.linkedin.com/in/huu-le/
  - https://github.com/JohnLeGit




