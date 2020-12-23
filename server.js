// Before adding clusters

// const express = require("express");

// const fabObj = require("./math-logic/fibonacci-series");

// const app = express();
// // http://localhost:3000?number=10
// app.get("/", (request, response) => {
//     let number = fabObj.calculateFibonacciValue(Number.parseInt(request.query.number));
//     response.send(`<h1>${number}</h1>`);
// });

// app.listen(3000, () => console.log("Express App is running on PORT : 3000"));

// After Adding Clusters
const express = require("express");
const cluster = require("cluster");
const OS = require("os");
const totalCPUs = OS.cpus().length;

const fabObj = require("./math-logic/fibonacci-series");

if (cluster.isMaster) {
  console.log(`Total Number of CPUs Count is ${totalCPUs}`);
  for (let i = 0; i < totalCPUs; i++) {
    cluster.fork();
  }
  cluster.on("online", (worker) => {
    console.log(`Worker id is ${worker.id} and PID is ${worker.process.pid}`);
  });
  cluster.on("exit", (worker) => {
    console.log(
      `Worker id is ${worker.id} and PID is ${worker.process.pid} is offline now`
    );
    console.log("Let's fork new cluster");
    cluster.fork();
  });
} else {
  const app = express();
  // http://localhost:3000?number=10
  app.get("/", (request, response) => {
    console.log(
      `worker process id - ${cluster.worker.id}, processID - ${cluster.worker.process.pid}, has accepted the request.`
    );
    let number = fabObj.calculateFibonacciValue(
      Number.parseInt(request.query.number)
    );
    response.send(`<h1>${number}</h1>`);
  });

  app.listen(3000, () => console.log("Express App is running on PORT : 3000"));
}
