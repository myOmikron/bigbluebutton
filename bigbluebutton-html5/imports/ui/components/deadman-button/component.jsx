import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import Button from '/imports/ui/components/button/component';
import logger from '/imports/startup/client/logger';

const SOCKET_URL = 'wss://bbb-dev.omikron.dev/deadman/internal/ws/subscribe';
const IS_ENABLED_URL = 'https://bbb-dev.omikron.dev/deadman/internal/isDeadmanEnabled';
const START_BREAK_URL = 'https://bbb-dev.omikron.dev/deadman/internal/startBreak';
const STOP_BREAK_URL = 'https://bbb-dev.omikron.dev/deadman/internal/stopBreak';
const CLICK_URL = 'https://bbb-dev.omikron.dev/deadman/internal/setNoDeadman';


/*
 * Helper function for making http requests:
 *
 * It uses GET on a passed url after appending the passed data to it.
 * When the request fails, it will be logged.
 * When it succeed, the passed callback function will be called with the response as parameter.
 * The only accepted response type is json.
 */
function request(url, data, callback) {
  const argStrings = Object.entries(data).map(([key, value]) => `${key}=${value}`).join('&');

  const xhr = new XMLHttpRequest();
  xhr.responseType = 'json';
  xhr.open('GET', `${url}?${argStrings}`);
  xhr.onreadystatechange = () => {
    if (xhr.readyState !== XMLHttpRequest.DONE) { return; }
    if (xhr.status !== 200) {
      logger.error(`Failed request to ${url}, got ${xhr.status}: ${xhr.statusText}`);
      return;
    }
    callback(xhr.response);
  };
  xhr.send();
}


class DeadmanButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inBreak: false,
      requireClick: false,
    };

    this.toastId = null;
    this.socket = null;

    // Bindings for use in request callback
    const createToast = this.createToast.bind(this);
    const connectSocket = this.connectSocket.bind(this);

    // Ask if deadman's button is required
    request(
      IS_ENABLED_URL,
      this.user,
      (response) => {
        if (!response.success) {
          // Log error in api
          logger.error(`Failed isDeadmanEnabled request: APIResponse: "${request.response.result}"`);
          return;
        }

        if (response.result.IsDeadmanEnabled) {
          // Start the actual stuff
          createToast();
          connectSocket();
        }
      },
    );

    window.deadman = this;
  }

  componentDidUpdate() {
    if (this.toastId) {
      toast.update(this.toastId, {
        render: this.renderIntoToast(),
      });
    }
  }

  onSocketOpen() {
    this.socket.send(JSON.stringify(this.user));
  }

  onSocketMessage(event) {
    console.log(event);
    this.setState({ requireClick: true });
  }

  onBreakButton() {
    const { inBreak } = this.state;
    const url = inBreak ? STOP_BREAK_URL : START_BREAK_URL;
    request(
      url,
      this.user,
      (response) => {
        console.log(response);
      },
    );
    this.setState(state => ({ inBreak: !state.inBreak }));
  }

  onDeadmanButton() {
    request(
      CLICK_URL,
      this.user,
      (response) => {
        console.log(response);
      },
    );
    this.setState({ requireClick: false });
  }

  get user() {
    const { userID, meetingID } = this.props;
    return { client_id: userID, meeting_id: meetingID };
  }

  createToast() {
    this.toastId = toast(this.renderIntoToast(), {
      onClose: () => { this.toastId = null; },
      autoClose: false,
      closeOnClick: false,
      closeButton: false,
      draggable: false,
    });
  }

  connectSocket() {
    logger.debug("Try connecting deadman's socket");

    // Construct socket object
    this.socket = new WebSocket(SOCKET_URL);

    // Try reconnecting on closed socket
    this.socket.onclose = this.connectSocket.bind(this);

    // Send who you are once
    this.socket.onopen = this.onSocketOpen.bind(this);

    // Handle incomming messages
    this.socket.onmessage = this.onSocketMessage.bind(this);
  }

  renderIntoToast() {
    const { inBreak, requireClick } = this.state;
    const disableButton = inBreak || !requireClick;
    return (
      <table>
        <tbody>
          <tr>
            <td>
              <Button
                label={inBreak ? "I'm back" : "I'll take a break"}
                color={inBreak ? 'danger' : 'primary'}
                onClick={this.onBreakButton.bind(this)}
              />
            </td>
            <td>
              <Button
                label="I'm not dead"
                color="danger"
                disabled={disableButton}
                ghost={disableButton}
                onClick={this.onDeadmanButton.bind(this)}
              />
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  render() {
    return null;
  }
}

export default DeadmanButton;

DeadmanButton.propTypes = {
  userID: PropTypes.string.isRequired,
  meetingID: PropTypes.string.isRequired,
};
