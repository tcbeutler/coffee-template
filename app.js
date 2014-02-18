var httpProxy = require('http-proxy');

var proxy = httpProxy.createProxyServer({
  target: 'http://localhost:3000'
});

proxy.listen(4000);
console.log('listening on port 4000');


function proxy(listenport, ??)