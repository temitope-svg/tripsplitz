import React from 'react';
import Svg, {Path} from 'react-native-svg';

import {BottomTabProps} from '../../utils/types';

const TripIcon = (props: BottomTabProps) => (
  <Svg width={16} height={18} fill="none" {...props}>
    <Path
      fill={props.focused ? '#059669' : '#54585C'}
      fillRule="evenodd"
      d="m10 .586-4 4v12.828l4-4V.586ZM1.707 2.293A1 1 0 0 0 0 3v10a1 1 0 0 0 .293.707L4 17.414V4.586L1.707 2.293ZM15.707 4.293 12 .586v12.828l2.293 2.293A1 1 0 0 0 16 15V5a1 1 0 0 0-.293-.707Z"
      clipRule="evenodd"
    />
  </Svg>
);

export default TripIcon;
