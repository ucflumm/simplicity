# simplicity app
## requirements
**docker** ```sudo apt install docker```
**docker-compose** ``sudo apt install docker-compose```

to run
```
mkdir simplicity
cd simplicity
```
clone repo
``` git clone ```
run docker compose up
``` docker compose up ```

container rebuild (in case it breaks from updating)
```docker-compose up --build --force-recreate --no-deps backend```
```docker-compose up --build --force-recreate --no-deps frontend```

#### api is in backend_api port **3030**
#### frontend runs react on port **3000**
#### mongodb
  - runs on port **27017**
  - mounted to ./mongodb for persistent storage
  - included some dummy data but we really shouldn't be pulling that in deployment
