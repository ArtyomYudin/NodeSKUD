const net = require('net');

const logger = require('../config/logger_config');
const dbConnect = require('../utils/db_connect');
const dbSelect = require('../utils/db_select');

async function currentDayAvayaCDR(wss, clientId) {
  try {
    const currentDayCDRRows = await dbConnect.cdr.query(dbSelect.avayaCDRCurrentDay);
    // logger.info(JSON.stringify(currentDayCDRRows[1]));
    if (clientId) {
      clientId.send(
        JSON.stringify({
          event: 'event_avaya_cdr_current_day',
          data: currentDayCDRRows[1],
        }),
      );
    } else {
      wss.clients.forEach(client => {
        client.send(
          JSON.stringify({
            event: 'event_avaya_cdr_current_day',
            data: currentDayCDRRows[1],
          }),
        );
      });
    }
  } catch (error) {
    logger.error(error);
  }
}

/*
async function sendFilteredAvayaCDR(clientId, filter) {
  try {
    const filteredAvayaCDRRows = await dbConnect.dashboard.query(dbSelect.vpnUserSessions(account));
    clientId.send(
      JSON.stringify({
        event: 'event_avaya_cdr_filtered',
        data: filteredAvayaCDRRows,
      }),
    );
  } catch (error) {
    logger.error(error);
  }
}
*/

function cdrcollector() {
  const server = net.createServer(socket => {
    socket.setEncoding('binary');
    // socket.setKeepAlive(true);
    let body;
    logger.info('client connected');
    socket.write('Ok.');

    socket.on('end', () => {
      logger.info('client disconnected');
      // logger.info(`Data received from client: ${body}`);
    });
    socket.on('data', chunk => {
      body += chunk;
      // logger.info(`Data received from client: ${Buffer.from(chunk).toString()}`);
      logger.info(`Data received from client: ${body}`);

      // echo data
      // const isKernelBufferFull = socket.write(body);
      // if (isKernelBufferFull) {
      //  console.log('Data was flushed successfully from kernel buffer i.e written successfully!');
      // } else {
      //  socket.pause();
      // }
    });
  });
  server.on('error', err => {
    throw err;
  });
  server.listen(9000, () => {
    logger.info('server bound');
  });
}

async function initApi(wss, clientId) {
  currentDayAvayaCDR(wss, clientId);
}

async function avayaEvents(wss, clientId) {
  setInterval(() => {
    currentDayAvayaCDR(wss, clientId);
  }, 300000);
}

exports.init = initApi;
exports.avayaEvents = avayaEvents;
// exports.sendFilteredAvayaCDR = sendFilteredAvayaCDR;
exports.cdrcollector = cdrcollector;
