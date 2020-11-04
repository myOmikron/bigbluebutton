import { withTracker } from 'meteor/react-meteor-data';
import DeadmanButton from './component';
import Auth from '/imports/ui/services/auth';

export default withTracker(() => ({
  userID: Auth.externUserID,
  meetingID: Auth.meetingID,
}))(DeadmanButton);
