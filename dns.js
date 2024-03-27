const dns = require('dns')
const dnsJS = require('dns-js')

dns.resolveCname('switchy2.zaions.com', (err, data) => {
  console.log({ err, data })
})

/*some code that will get you a dns message buffer*/
var result = dnsJS.DNSPacket.parse('switchy2.zaions.com')

console.log(result)
