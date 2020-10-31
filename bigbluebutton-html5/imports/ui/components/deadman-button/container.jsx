import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import DeadmanButton from './component';
import Auth from '/imports/ui/services/auth';

const DeadmanButtonContainer = ({ ...props }) => <DeadmanButton />;

export default withTracker(props => ({
  needsCert: true,
}))(DeadmanButton);
