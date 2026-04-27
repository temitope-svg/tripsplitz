import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {BottomTabProps} from '../../utils/types';
const ProfileIcon = (props: BottomTabProps) => (
  <Svg width={14} height={15} fill="none" {...props}>
    <Path
      fill={props.focused ? '#059669' : '#54585C'}
      d="M7 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM0 15a7 7 0 1 1 14 0H0Z"
    />
  </Svg>
);
export default ProfileIcon;
