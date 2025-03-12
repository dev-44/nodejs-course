const users = require('./dummy-users');
const fs = require('fs');

const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === '/') {
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<body>');
    res.write('<h1>Hello to the Home Page</h1>');
    res.write('<form action="/create-user" method="POST"><input type="text" name="user"/><button type="submit">Create User</button></form>')
    res.write('</body>');
    res.write('</html>');
    res.end();
  };

  if (url == '/users') {
    res.write('<html>');
    res.write('<body><h1>Users</h1><ul>');
    users.map((user) => res.write(`<li id=${user.id}>${user.firstName} ${user.lastName}</li>`))
    res.write('</ul></body>')
    res.write('</html>');
    return res.end();
  };

  if (url === '/create-user' && method === 'POST') {
    const body = [];
    
    req.on('data', (chunk) => {
      body.push(chunk);
    });

    req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString();
      const newUser = parsedBody.split('=')[1];
      fs.writeFile('new_user.txt', newUser, err => {
        res.statusCode = 302;
        res.setHeader('Location', '/');
        return res.end();
      })
    });


  } 
};

module.exports = requestHandler;