/**
 * Конфигурационный файл
 */

const config = {
  server: {
    host: 'it.center-inform.ru',
    // host: 'localhost',
    port: 3000,
  },
  revers: {
    host: '172.21.110.139',
    port: 24532,
  },
  database: {
    host: 'localhost',
    // host: '172.20.4.195',
    user: 'ngdash',
    password: 'S9oE43h5OMaw',
    dbname: 'ngdashboard',
  },
  cdrdatabase: {
    host: 'localhost',
    // host: '172.20.4.195',
    user: 'cdrvhost_rw',
    password: 'pjJ49E7K',
    dbname: 'cdrvhost',
  },
  jwt: {
    secret: 'HxQiRJ1LkSga',
  },
  zabbix: {
    host: 'http://zabbix.center-inform.ru/api_jsonrpc.php',
    user: 'ZabbixAPIUser',
    password: 'G4SCb68LIbL8',
  },
};

module.exports = config;
