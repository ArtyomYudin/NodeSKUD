const logger = require('../config/logger_config');
const dbConnect = require('../utils/db_connect');
const dbSelect = require('../utils/db_select');

async function currentDayAvayaCDR(wss, clientId) {
  try {
    const dhcpAllLeasesRows = await dbConnect.query(dbSelect.avayaCDRCurrentDay);
    // logger.info(JSON.stringify(dhcpAllLeasesRows));
    if (clientId) {
      clientId.send(
        JSON.stringify({
          event: 'event_avaya_cdr_current_day',
          data: dhcpAllLeasesRows,
        }),
      );
    } else {
      wss.clients.forEach(client => {
        client.send(
          JSON.stringify({
            event: 'event_avaya_cdr_current_day',
            data: dhcpAllLeasesRows,
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
  }, 60000);
}

exports.init = initApi;
exports.avayaEvents = avayaEvents;
