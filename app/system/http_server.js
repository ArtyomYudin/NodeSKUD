const https = require('https');
const constants = require('crypto');
const fs = require('fs');
const config = require('../config/system_config');
const reversAPIServer = require('./revers_api_server');
const logger = require('../config/logger_config');

const userLoginCheck = require('../auth/user_login_check');

const apiEmployee = require('../api/api_employee');
const apiGetChartData = require('../api/api_chart');

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'Content-Type, Access-Control-Allow-Origin, Access-Control-Allow-Headers, Authorization, X-Requested-With',
  'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
  // 'Access-Control-Max-Age': 2592000, // 30 days
};

const options = {
  key: fs.readFileSync('./cert/center_inform.key'),
  cert: fs.readFileSync('./cert/center_inform.crt'),
  requestCert: false,
  // secureProtocol: 'SSLv23_method',
  secureOptions: constants.SSL_OP_NO_SSLv3 || constants.SSL_OP_NO_SSLv2,
};

function initHttpServer() {
  const httpsServer = https.createServer(options, (request, response) => {
    if (request.method === 'OPTIONS') {
      response.writeHead(204, headers);
      response.end();
      return;
    }

    let body = [];
    request.on('error', err => {
      logger.error(err);
    });
    request.on('data', chunk => {
      body.push(chunk);
    });
    request.on('end', () => {
      body = Buffer.concat(body).toString();
      response.on('error', err => {
        logger.error(err);
      });
      if (request.url === '/api/auth' && request.method === 'POST') {
        userLoginCheck(body, response);
      }
      if (request.url === '/api/employee' && request.method === 'POST') {
        apiEmployee.apiGetEmployee(body, response);
      }
      if (request.url === '/api/employee' && request.method === 'GET') {
        apiEmployee.apiGetAllEmployee(body, response);
      }
      if (request.url === '/api/charts' && request.method === 'POST') {
        apiGetChartData(body, response);
      }
      if (request.method === 'POST' && request.url === '/api') {
        reversAPIServer.sendExtJSON(body);
        response.end();
      }
    });

    /*
    if (request.url === '/api/auth' && request.method === 'POST') {
      let body = [];
      request.on('error', (err) => {
        logger.error(err);
      });
      request.on('data', (chunk) => {
        body.push(chunk);
      });
      request.on('end', () => {
        body = Buffer.concat(body).toString();
        response.on('error', (err) => {
          logger.error(err);
        });
        userLoginCheck(body, response);
      });
    }

    if (request.url === '/api/employee' && request.method === 'POST') {
      let body = [];
      request.on('error', (err) => {
        logger.error(err);
      });
      request.on('data', (chunk) => {
        body.push(chunk);
      });
      request.on('end', () => {
        body = Buffer.concat(body).toString();
        response.on('error', (err) => {
          logger.error(err);
        });
        apiEmployee.apiGetEmployee(body, response);
      });
    }

    if (request.url === '/api/employee' && request.method === 'GET') {
      let body = [];
      request.on('error', (err) => {
        logger.error(err);
      });
      request.on('data', (chunk) => {
        body.push(chunk);
      });
      request.on('end', () => {
        body = Buffer.concat(body).toString();
        response.on('error', (err) => {
          logger.error(err);
        });
        apiEmployee.apiGetAllEmployee(body, response);
      });
    }

    if (request.url === '/api/charts' && request.method === 'POST') {
      let body = [];
      request.on('error', (err) => {
        logger.error(err);
      });
      request.on('data', (chunk) => {
        body.push(chunk);
      });
      request.on('end', () => {
        body = Buffer.concat(body).toString();
        response.on('error', (err) => {
          logger.error(err);
        });
        apiChart.apiGetChartData(body, response);
      });
    }

    if (request.method === 'POST' && request.url === '/api') {
      let body = [];
      request.on('error', (err) => {
        logger.error(err);
      });
      request.on('data', (chunk) => {
        body.push(chunk);
      });
      request.on('end', () => {
        body = Buffer.concat(body).toString();
        response.on('error', (err) => {
          logger.error(err);
        });
        reversAPIServer.sendExtJSON(body);
        response.end();
      });
    } // else {
    // response.statusCode = 404;
    // response.end();
    // }
    */
  });

  httpsServer.listen(config.server.port, config.server.host, () => {
    logger.info(`Server running at http://${config.server.host}:${config.server.port}/ ${process.pid}`);
  });

  return httpsServer;
}

module.exports = initHttpServer;
