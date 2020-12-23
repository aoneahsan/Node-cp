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

// // After Adding Clusters
// const express = require("express");
// const cluster = require("cluster");
// const OS = require("os");
// const totalCPUs = OS.cpus().length;

// const fabObj = require("./math-logic/fibonacci-series");

// if (cluster.isMaster) {
//   console.log(`Total Number of CPUs Count is ${totalCPUs}`);
//   for (let i = 0; i < totalCPUs; i++) {
//     cluster.fork();
//   }
//   cluster.on("online", (worker) => {
//     console.log(`Worker id is ${worker.id} and PID is ${worker.process.pid}`);
//   });
//   cluster.on("exit", (worker) => {
//     console.log(
//       `Worker id is ${worker.id} and PID is ${worker.process.pid} is offline now`
//     );
//     console.log("Let's fork new cluster");
//     cluster.fork();
//   });
// } else {
//   const app = express();
//   // http://localhost:3000?number=10
//   app.get("/", (request, response) => {
//     console.log(
//       `worker process id - ${cluster.worker.id}, processID - ${cluster.worker.process.pid}, has accepted the request.`
//     );
//     let number = fabObj.calculateFibonacciValue(
//       Number.parseInt(request.query.number)
//     );
//     response.send(`<h1>${number}</h1>`);
//   });

//   app.listen(3000, () => console.log("Express App is running on PORT : 3000"));
// }

// test for workers

const express = require("express");
const cluster = require("cluster");
const OS = require("os");
const totalCPUs = OS.cpus().length;

if (cluster.isMaster) {
  console.log(`Total Number of CPUs Count is ${totalCPUs}`);
  console.log(`Master process ID = ${process.pid}`);
  const worker1 = require("child_process").fork(
    "./workers/fab-series-worker1.js"
  );
  const worker2 = require("child_process").fork(
    "./workers/fab-series-worker2.js"
  );

  console.log(`worker1, worker ID = ${worker1.pid}`);
  console.log(`worker2, worker ID = ${worker2.pid}`);

  worker1.on("message", (number) => {
    console.log(`Fab number from child process 1, number = ${number}`);
  });

  worker2.on("message", (number) => {
    console.log(`Fab number from child process 2, number = ${number}`);
  });

  for (let i = 0; i < totalCPUs - 2; i++) {
    // 2 negative because two workers already runing
    let worker = cluster.fork();
    console.log(`worker process started, process ID = ${worker.process.pid}`);
  }
  cluster.on("online", (worker) => {
    console.log(`Worker id is ${worker.id} and PID is ${worker.process.pid}`);
    worker.on("message", (num) => {
      if (num % 2 === 0) {
        worker1.send(num);
      } else {
        worker2.send(num);
      }
    });
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
    process.send(request.query.number);
    console.log(
      `process id = ${process.pid}, has recived the request, number = ${request.query.number}`
    );
    response.end(`<h1>your number has recived.</h1>`);
  });

  app.listen(3000, () => console.log("Express App is running on PORT : 3000"));
}
