import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import Button from '/imports/ui/components/button/component';


class DeadmanButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inBreak: false,
      requireHeartbeat: false,
    };

    this.toastId = null;
  }

  componentDidMount() {
    const { needsCert } = this.props;

    if (this.toastId) {
      toast.dismiss(this.toastId);
    }

    if (needsCert) {
      this.toastId = toast(this.renderIntoToast(), {
        onClose: () => { this.toastId = null; },
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
        draggable: false,
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.toastId) {
      toast.update(this.toastId, {
        render: this.renderIntoToast(),
      });
    } else {
      this.componentDidMount();
    }
  }

  renderIntoToast() {
    const disableButton = this.state.inBreak || !this.state.requireHeartbeat;
    return (
      <table>
        <tr>
          <td>
            <Button
              label={this.state.inBreak ? "I'm back" : "I'll take a break"}
              color={this.state.inBreak ? 'danger' : 'primary'}
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
      </table>
    );
  }

  onBreakButton() {
    this.setState(state => ({
      inBreak: !state.inBreak,
      requireHeartbeat: true,
    }));
  }

  onDeadmanButton() {
    this.setState({ requireHeartbeat: false });
  }

  render() {
    return null;
  }
}

export default DeadmanButton;

DeadmanButton.propTypes = {
  needsCert: PropTypes.bool.isRequired,
};
