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
