## Getting started


Prepare - install MySQL and Redis.

Edit `config/settings.js` to set your database, user & password.

```bash
npm install
npm install -g orm-migrate
DB_URL=mysql://[user]:[password]@[host]/[db_name] migrate --up
node server
```

And then open up [localhost:3000](http://localhost:3000/) or see online example - [http://163.172.150.189:3000/](http:://163.172.150.189:3000/)
