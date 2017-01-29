# Dookie.me API

## Format
    
    {
      "activities": {
        "2017-01-29T19:48:06+00:00": 1,
        "2017-01-29T19:58:06+00:00": 2,
        "2017-01-29T20:15:06+00:00": 5
      },
      "name": "Nipsu"
    }

## Add dog, https://dookie-1a65d.firebaseio.com/.json

request

    curl -X POST -d '{"name": "NAME"}' 'https://dookie-1a65d.firebaseio.com/.json'

response

    {"name":"UUID"}

## Add/edit activity, https://dookie-1a65d.firebaseio.com/UUID/activities.json

time format: YYYY-MM-DDTHH:MM:SSZ

- 1: poo
- 2: poo + pee
- 3: pee
- 4: food
- 5: walk

request

    curl -X PATCH -d '{"2017-01-29T20:15:06+00:00": 5}' 'https://dookie-1a65d.firebaseio.com/UUID/activities.json'

response

    {"2017-01-29T20:15:06+00:00":5}

## Delete activities, https://dookie-1a65d.firebaseio.com/UUID/activities.json

request

    curl -X DELETE -d '{"2017-01-29T20:15:06+00:00": 5}' 'https://dookie-1a65d.firebaseio.com/UUID/activities/.json'

response

    null