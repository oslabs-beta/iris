<p align="center">
<img src= "https://media.discordapp.net/attachments/1001284784078733404/1012010119787204678/IRIS_7.png" width="300" height="300" align="center">
</p>
<h1 align="center" style="font-size: 40px">Iris: A Kafka Health Monitoring Suite</h1>
<p align="center">
  <img alt="GitHub" src="https://img.shields.io/badge/License-MIT-green.svg">
  <img alt="Contributors" src="https://img.shields.io/github/contributors/oslabs-beta/iris?color=%239d65c9&style=flat-square">
  <img alt="GitHub All Releases" src="https://img.shields.io/github/downloads/oslabs-beta/iris/total?color=green">
  <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/oslabs-beta/iris?color=orange">
  <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/oslabs-beta/iris?style=social">  

</p>

# Overview

Apache Kafka is an event-driven data streaming platform that stores and brokers sensitive information with high data throughput and fault tolerance. 
Broker clusters require health monitoring to better inform partitioning, replication, data persistence and other intricate Kafka maintenance processes. 
Iris offers a dynamic solution to observe your Kafka platform in real time, compare against historically logged data and ensures your broker does not throttle user experience.

# Setting up your environment

Iris provides a containerized Docker environment with a highly configurable Kafka container. There are two separate docker-compose files: one for the Kafka/Zookeeper environment and the other for the JMX-Exporter/Prometheus environment. Please see the ```docker-compose-kafka.yml``` if you wish to configure your broker. In order to run Iris properly, you will need to run both files. 

1) Install Docker: https://docs.docker.com/get-docker/

2) Fork the repo from the ```main``` branch

3) Run the command: 
```sh 
npm install
```

4) Open Docker and check Images tab, it should include the following Docker images to run the container environments. If not, please install the latest images: 
```sh 
docker pull
```

<img width="1270" alt="image" src="https://user-images.githubusercontent.com/102982879/183763901-94dcec89-b7d8-4799-9686-b972782edf9c.png"  width="#00" height="#00">


5) Once Docker has been booted up, run the following two commands in separate terminals. Please allow the Kafka container to fully boot and stabilize before running the JMX and Prometheus containers. Not waiting for the Kafka container to fully boot up may result in JMX failing to identify and scrape the exposed Kafka ports. You can view the Kafka containers in either the terminal or your Docker Desktop logs.
```sh
docker compose -f docker-compose.kafka.yml up
```  
```sh
docker compose -f docker-compose.scrape.yml up
```  

6) Now that the Kafka broker is running and the ports are being scraped properly, run your Kafka dependent program across the broker to begin streaming your data. You may refer to the provided files in the ```kafkaTest``` folder for reference. Ports are accessing the Kafka broker on ```localhost:9092```

7) To start the application and begin viewing your broker's health, in another terminal, run command: 
```sh
npm run dev
```

# Viewing the Metric

1) The application will load onto ```localhost:8080``` where you can browse your incoming metrics. 
  - On the left pane, there are persistent histograms and piecharts.
  - On the right pane, you can add line charts with different metrics.

2) You can configure the ```Metric``` and ```Time Frame``` of each chart individually generated in the right pane.

<img src= "https://media.giphy.com/media/gG2vTWd5WWdUbaRJnd/giphy.gif" width="#00" height="#00">

3) Click on the ```+``` button in the upper right hand corner to add additional line charts.

4) Click on the ```X``` button on each line chart container to delete each chart.

5) Click on the ```clock``` button underneath the ```+``` in the upper right hand corner to view historical data at a specific time interval. Data is logged on a 15 sec interval to an AWS RDS SQL database.

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

We provide an end to end Kafka producer and consumer to measure the stability of the Iris health monitor. The ```Producer``` and ```Consumer``` files in the ```kafkaTest``` folder contain message files streamed to the Kafka Broker using ```AVRO``` schema and ```KafkaJS```. 

- In one terminal, run the command: 
```sh
npm run start:producer
``` 
  <img width="482" alt="image" src="https://user-images.githubusercontent.com/102982879/183764487-57fdc27c-080a-4669-bc5c-ba6d99c2ec94.png">

- In a separate terminal, run the command: 
```sh
npm run start:consumer
```
  <img width="371" alt="image" src="https://user-images.githubusercontent.com/102982879/183764560-3dd0e3bf-32c6-4b7d-aef9-6ef30a777571.png">

Now you should be passing messages across your Kafka Broker. 

# Contributions

If you have recommendations on how to improve Iris, please fork this repo and make a pull request.

# Authors

- Brennan Lee ( [Linkedin](https://www.linkedin.com/in/brennan-lee/) | [Github](https://github.com/blee3395) )
  
- Michael Reyes ( [Linkedin](https://www.linkedin.com/in/michael-reyes-b4319216b/) | [Github](https://github.com/Michaelr499) )

- Walter Li ( [Linkedin](https://www.linkedin.com/in/li-walter/) | [Github](https://github.com/findwalle) )

- Huu (John) Le ( [Linkedin](https://www.linkedin.com/in/huu-le-06a25a11b/) | [Github](https://github.com/JohnLeGit) )




