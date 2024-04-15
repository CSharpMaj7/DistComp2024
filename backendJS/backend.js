//code reference 
//https://stackoverflow.com/questions/12006417/node-js-server-that-accepts-post-requests

const http = require('http')

const server = http.createServer(function(request, response) {
  console.dir(request.param)
  response.setHeader('Access-Control-Allow-Origin', '*'); /* @dev First, read about security */
  response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
  response.setHeader('Access-Control-Max-Age', 2592000); // 30 days
  response.setHeader('Access-Control-Allow-Headers', 'content-type'); // Might be helpful
  if (request.method == 'POST') {
    console.log('POST')
    var body = ''
    request.on('data', function(data) {
      body += data
      console.log('Partial body: ' + body)
    })
    request.on('end', function() {
      console.log('Body: ' + body)
      response.writeHead(200, {'Content-Type': 'text/html'})
      response.end('post received')
    })
  } else {
    console.log('GET')
    var html = `
            <html>
                <body>
                    <form method="post" action="http://localhost:8000">Name: 
                        <input type="text" name="name" />
                        <input type="submit" value="Submit" />
                    </form>
                </body>
            </html>`
    response.writeHead(200, {'Content-Type': 'text/html'})
    response.end(html)
  }
})

const port = 8000
const host = '0.0.0.0'
server.listen(port, host)
console.log(`Listening at http://${host}:${port}`)



