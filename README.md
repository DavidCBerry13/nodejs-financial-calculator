# Express.js Financial Calculator Sample App

A simple little app to learn about and explore Express.js.

**Starting the application**

```npm start```

The app should be listening on `http://localhost:3000`


## Libraries Used

- Bootstrap 5.2.1 (from CDN in layout.pug)
- NumeralJS (for formatting numbers)


## Running Docker Container

Build the docker image

```bash
docker build -t davidcberry13/nodejs-financial-calculator:v1 .
```

Get the docker image id from the `docker ls` command

```bash
docker image ls
```

Then run the image.  This maps port 8080 in the container to port 5000 on the local machine (so browse to http://localhost:5000)

```bash
docker run -p 5000:8080 <image id>
```
