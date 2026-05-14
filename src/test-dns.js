const dns = require('dns');

console.log('Using DNS servers:', dns.getServers());

dns.setServers(['1.1.1.1', '8.8.8.8']);
console.log('Set DNS servers to:', dns.getServers());

dns.resolveSrv('_mongodb._tcp.mongodb.tyrxhwb.mongodb.net', (err, addresses) => {
  if (err) {
    console.error('resolveSrv error:');
    console.error(err);
    process.exit(1);
  }
  console.log('resolveSrv result:');
  console.log(addresses);
  process.exit(0);
});
