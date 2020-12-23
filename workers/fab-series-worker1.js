const fabObj = require('./../math-logic/fibonacci-series');

process.on("message", number => {
    const fabNum = fabObj.calculateFibonacciValue(number);
    console.log(`FAB Series 1 - ProcessID = ${process.pid}`);
    process.send(fabNum);
});