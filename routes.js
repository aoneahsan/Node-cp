// Before using Express




// const fs = require('fs');

// const requestHandler = (req, res) => {
//     const url = req.url;
//     const method = req.method;
//     res.setHeader('Content-Type', 'text/html');
//     if (url === '/') {
//         res.write('<html lang="en"> <head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Form</title> </head> <body> <form action="/message" method="POST"> <input type="text" name="message" required> <button type="submit"> Save </button> </form> </body> </html> ');
//         return res.end();
//     }
    
//     if (url === '/message' && method == 'POST') {
//         const body = [];
//         req.on('data', (chunk) => {
//             body.push(chunk);
//         });

//         req.on('end', () => {
//             const parsedBody = Buffer.concat(body).toString();
//             const message = parsedBody.split('=')[1];
//             fs.writeFileSync('message.txt', message);
//         });
//         res.statusCode = 302;
//         res.setHeader('Location', '/');
//         return res.end();
//     }
//     if (url === '/message' && method == 'GET') {
//         res.writeHead(302, {
//             'Location': '/'
//         });
//         return res.end();
//     }
// }

// module.exports = requestHandler; // than simple use file name used to import

// // exports = requestHandler; // than simple use file name used to import

// // module.exports.anyName = requestHandler; // import file and access key holding value an same for down
// // exports.anyName = requestHandler; // import file and access key holding value an same for down

// // module.exports = {
// //     anyName: requestHandler
// // };

// // exports = {
// //     anyName: requestHandler
// // };