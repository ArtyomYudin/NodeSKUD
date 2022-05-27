const Botkit = require('botkit-legacy');

const controller = Botkit.jabberbot({
  json_file_store: './bot_storage/',
});

const zabbixBot = controller.spawn({
  client: {
    jid: 'zabbixbot@center-inform.ru',
    password: 'ihfq,brec',
    host: 'angela.center-inform.ru',
    port: 5222,
  },
});

/*
bot.say({
  user: 'a.yudin@center-inform.ru',
  text: 'hi!',
});
*/
exports.zabbixBot = zabbixBot;
