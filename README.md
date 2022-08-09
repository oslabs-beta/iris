## IRIS
A monitoring suite that provides insights on health metrics of your Kafka broker
<p align="center">
<img src= "https://user-images.githubusercontent.com/102982879/183760543-c2fa9913-f227-471c-8928-672973ad63d8.png" width="150" height="150" align="center">
</p>

## Overview

Kafka event streams broker sensitive information with high data throughput and therefore must to be highly resilient to failure. 
Clusters require health monitoring to better inform manual partitioning, broker replication and other intricate Kafka maintenance processes. 
This ensures Kafka brokers do not become throttled and maintain fault tolerance.


## Step to start the project

1) Install JAVA: https://www.oracle.com/java/technologies/downloads/#jdk18-mac 

   - Only for testing Kafka on local terminal purposes

2) Install Docker: https://docs.docker.com/get-docker/

3) Follow step by step: https://hevodata.com/learn/install-kafka-on-mac/ to test kafka on local terminal

4) Fork the project from ```main``` branch

5) Run ```npm install```

6) Open Docker and check Images tab, it should includes
<img width="1270" alt="image" src="https://user-images.githubusercontent.com/102982879/183763901-94dcec89-b7d8-4799-9686-b972782edf9c.png"  width="100" height="450">


7) Make sure your Desktop Docker is running, open up 3 seperate terminals on your VSCODE 

- First terminal, run ```docker-compose up```

  - Watch your terminal, if you get this error, close your Docker and VSCODE and rerun again![image](https://user-images.githubusercontent.com/102982879/183760177-7ae42fa9-02f7-46c6-8059-ad729448eccd.png)

- Second terminal, run ```npm run start:producer```. It should show:
<img width="482" alt="image" src="https://user-images.githubusercontent.com/102982879/183764487-57fdc27c-080a-4669-bc5c-ba6d99c2ec94.png">


- Third terminal, run ```npm run start:consumer```. It should show:
<img width="371" alt="image" src="https://user-images.githubusercontent.com/102982879/183764560-3dd0e3bf-32c6-4b7d-aef9-6ef30a777571.png">

8) Keep 3 terminals run while running the project

9) Open another terminal, run ```npm run dev``` to start the project

## Viewing the Metric

1) After running ```npm run dev```, ```localhost:8081``` should pop up in the browser
<img src = "https://user-images.githubusercontent.com/102982879/183765267-b8e76e06-7556-45d0-be8d-a8d8d5aef054.png" width="900" height="600">

2) Click on Metric bar to change to different Kafka Metric with different Time Frame

## Other localhost:

1) To view list of metrics and data : ```localhost:5556/metrics```

2) To view Prometheus : ```localhost:9090```

3) To view all metrics available: ```http://localhost:9090/api/v1/label/__name__/values```

4) In order to query different Prometheus end point, follow the syntax : ```http://localhost:9090/api/v1/query?query= {Enter the Metric Name}{TimeRange}.```

- For example: ```http://localhost:9090/api/v1/query?query=kafka_server_broker_topic_metrics_messagesinpersec_rate[1h]```

## Authors

1) Brennan Lee

2) Michael Reyes

3) Walter Li

4) Huu (John) Le
