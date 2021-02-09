import { Strophe, $pres } from 'strophe.js';
import 'strophejs-plugin-muc';
import ChatService from '/imports/ui/components/chat/service';
import getFromUserSettings from '/imports/ui/services/users-settings';
import logger from '/imports/startup/client/logger';

let username;
let userUUID;
let xmppPassword;
let server;
let roomName;

let connection = null;

function enterRoom() {
  const room = `${roomName}@conference.${server}`;
  logger.info(`Connecting to: ${room}`);
  connection.muc.init(connection);
  connection.muc.join(room, username); // , logger.info, logger.info, logger.info);
  connection.muc.setStatus(room, `${username}@${server}`, 'subscribed', 'chat');
  logger.info(`Connected to: ${room}`);
  return true;
}

function onMessage(stanza) {
  // const to = stanza.getAttribute('to');
  const from = stanza.getAttribute('from');
  // const type = stanza.getAttribute('type');

  const bodys = stanza.getElementsByTagName('body');
  if (bodys.length === 0) {
    logger.error("Message doesn't contain any body");
    return true;
  }
  const body = bodys[0];
  const msg = Strophe.xmlunescape(Strophe.getText(body));

  /*const delays = stanza.getElementsByTagName('delay');
  let timestamp;
  if (delays[0] !== undefined) {
    timestamp = delays[0].getAttribute('stamp');
  } else {
    timestamp = null;
  }
  logger.info(timestamp);*/

  const sender = Strophe.getResourceFromJid(from);

  ChatService.sendGroupMessage(`${sender} wrote:\n${msg}\n`);
  return true;
}

function onStanza(stanza) {
  logger.info(stanza);
  return true;
}

// Function for Handling XMPP Connection, Joining a Room, and Initializing Intervals
function onConnect(status) {
  if (status === Strophe.Status.CONNECTING) {
    logger.info('Connecting to XMPP Server...');
  } else if (status === Strophe.Status.CONNFAIL) {
    logger.info('Connection to XMPP Server Failed...');
  } else if (status === Strophe.Status.DISCONNECTING) {
    logger.info('Disconnecting from XMPP Server...');
  } else if (status === Strophe.Status.DISCONNECTED) {
    logger.info('Disconnected from XMPP Server...');
  } else if (status === Strophe.Status.CONNECTED) {
    logger.info('Connected to XMPP Server.');
    // set presence
    connection.send($pres());
    // set handlers
    connection.addHandler(onStanza);
    connection.addHandler(onMessage, null, 'message', null, null, null);

    enterRoom();

    return true;
  }
}

function connect() {
  connection = new Strophe.Connection(`https://${server}/http-bind/`);
  /* connection.rawInput = (data) => {
       logger.info('RECV:', data);
     };
     connection.rawOutput = (data) => {
       logger.info('SENT:', data);
     }; */
  connection.connect(`${userUUID}@${server}`, xmppPassword, onConnect);
  // connection.addHandler(logger.info, null, 'message', null, null, null);
}

let retry = 0;
function tryLoading() {
  try {
    const obj = JSON.parse(getFromUserSettings('bbb_shortcuts', null).replace(/^salt/, ''));
    // logger.info(obj);
    username = obj.username;
    userUUID = obj.userUUID;
    xmppPassword = obj.xmppPassword;
    server = obj.server;
    roomName = obj.roomName;
    connect();
  } catch (e) {
    if (retry < 10) {
      logger.error(e);
      retry += 1;
      setTimeout(tryLoading, 1000);
    }
  }
}
tryLoading();
