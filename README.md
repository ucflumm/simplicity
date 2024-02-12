# simplicity app
to run
```
mkdir simplicity
cd simplicity
```
clone repo
``` git clone ```
build
```docker-compose build```
run docker compose up
``` docker compose up ```

#### api is in backend_api port **3030**
#### frontend runs react on port **3000**
#### mongodb
  - runs on port **27017**
  - mounted to ./mongodb for persistent storage
  - included some dummy data but we really shouldn't be pulling that in deployment
