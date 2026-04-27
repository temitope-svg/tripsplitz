import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {BottomTabProps} from '../../utils/types';
const MessagesIcon = (props: BottomTabProps) => (
  <Svg width={16} height={12} fill="none" {...props}>
    <Path
      fill={props.focused ? '#059669' : '#54585C'}
      d="M.003 1.884 8 5.882l7.997-3.998A2 2 0 0 0 14 0H2A2 2 0 0 0 .003 1.884Z"
    />
    <Path
      fill="#54585C"
      d="m16 4.118-8 4-8-4V10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4.118Z"
    />
  </Svg>
);
export default MessagesIcon;
