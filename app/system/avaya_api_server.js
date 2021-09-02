// const net = require('net');

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

async function sendFilteredAvayaCDR(clientId, filter) {
  let filterQuery = '';
  if (filter.dateStart !== '') {
    filterQuery = `WHERE (cdr_t.traffic_date >= '${filter.dateStart}'`;
  } else {
    filterQuery = 'WHERE (cdr_t.traffic_date >="'.date('Y-m-d');
  }
  if (filter.dateEnd === '') {
    filterQuery = `${filterQuery} AND cdr_t.traffic_date <="${filter.dateEnd}")`;
  } else {
    filterQuery = `${filterQuery})`;
  }
  logger.info(dbSelect.avayaCDRFiltered(filterQuery).trim());

  try {
    const filteredAvayaCDRRows = await dbConnect.cdr.query(dbSelect.avayaCDRFiltered(filterQuery));
    logger.info(filteredAvayaCDRRows);
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
exports.currentDayAvayaCDR = currentDayAvayaCDR;
exports.sendFilteredAvayaCDR = sendFilteredAvayaCDR;
