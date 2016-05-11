### Back-end

```
npm start
```
Browse to [http://localhost:3000/hca/explorer](http://localhost:3000/hca/explorer)

### Docker
#### Environment setup
Docker is being used for production deploys of this application. The Dockerfile
builds an Alpine Linux based node environment.

On OsX and Windows, Docker does not yet have native kernel support. Instead, a
wrapper program `docker-machine` is used to boot a minimal linux virtual machine
that then executes the docker commands. To set this up, just run
```
docker-machine start
```

This starts the `default` Docker virtual machine (previously known as boot2docker)
This should only need to be done once per boot of your actual machine since the
VM continues to run in the background.

Note that the result of all docker builds are actually housed within this
virtual machine and over time you can run it out of diskspace. Search
online for instructions for handling such a situation.

Aftr the machine has started, ensure the environment variables necessary for
connecting to the machine are set by running
```
eval $(docker-machine env)
```

To find the IP address of the docker-machine, run
```
docker-machine ip
```


#### Building the container
To build a new container tagged `awongdev/hca-staging`, from the root of the repostiory run:

```
scripts/make-docker.sh
```


#### Running the container
To run the built container:
```
scripts/run-docker.sh
```
