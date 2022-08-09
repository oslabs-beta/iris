const mock1h = {
    "status": "success",
    "data": {
        "resultType": "matrix",
        "result": [
            {
                "metric": {
                    "__name__": "kafka_server_broker_topic_metrics_bytesinpersec_rate",
                    "aggregate": "OneMinute",
                    "env": "cluster-demo",
                    "instance": "jmx-kafka:5556",
                    "job": "kafka",
                    "service": "kafka-broker"
                },
                "values": [
                    [
                        1659385499.997,
                        2
                    ],
                    [
                        1659385530.002,
                        15
                    ],
                    [
                        1659385545.002,
                        34
                    ],
                    [
                        1659385560.005,
                        65
                    ],
                    [
                        1659385575.002,
                        3
                    ],
                    [
                        1659385589.997,
                        6
                    ],
                    [
                        1659385605.003,
                        87
                    ],
                    [
                        1659385619.997,
                        45
                    ],
                    [
                        1659385635.002,
                        65
                    ],
                    [
                        1659385650.007,
                        4
                    ],
                    [
                        1659385665.001,
                        4
                    ],
                    [
                        1659385680,
                        5
                    ],
                    [
                        1659385695.002,
                        65
                    ],
                    [
                        1659385710,
                        76
                    ]
                ]
            },
        ]
    }
}

module.exports = mock1h;