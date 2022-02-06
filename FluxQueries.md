#Flux Queries 

## Data extraction

The data is provided by the SNI organizators. They have given us access to a lot of devices. We chose to use several, that we can extract PM 2.5, PM 10, CO2 and Humidity data. 

For the final presentation, we decided to use the PM 2.5 and PM 10 metrics. 

The queries are very simple: 


```
from(bucket: "Dashboards")
  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
  |> filter(fn: (r) => r["_measurement"] == "NoxSoopsNl")
  |> filter(fn: (r) => r["_field"] == "MICRO_GRAM_CUBIC_METER")
  |> filter(fn: (r) => r["metric"] == "PM25")
  |> yield(name: "mean")
```

and

```
from(bucket: "Dashboards")
  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
  |> filter(fn: (r) => r["_measurement"] == "NoxSoopsNl")
  |> filter(fn: (r) => r["_field"] == "MICRO_GRAM_CUBIC_METER")
  |> filter(fn: (r) => r["metric"] == "PM10")
  |> yield(name: "mean")
```

This gives us all the information that we need to then model it and give it flavor with the Grafana tool 