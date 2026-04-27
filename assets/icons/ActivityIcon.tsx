import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {BottomTabProps} from '../../utils/types';
const ActivityIcon = (props: BottomTabProps) => (
  <Svg width={20} height={20} fill="none" {...props}>
    <Path
      fill="#059669"
      fillRule="evenodd"
      d="M12.288 1.288a3.235 3.235 0 0 0-4.576 0L1.288 7.712a3.235 3.235 0 0 0 0 4.576l6.424 6.424a3.235 3.235 0 0 0 4.576 0l6.424-6.424a3.235 3.235 0 0 0 0-4.576l-6.424-6.424Zm1.043 9.587a1.237 1.237 0 0 0 0-1.75L10.875 6.67a1.237 1.237 0 0 0-1.75 0L6.67 9.125a1.237 1.237 0 0 0 0 1.75l2.456 2.456a1.237 1.237 0 0 0 1.75 0l2.456-2.456Z"
      clipRule="evenodd"
    />
  </Svg>
);
export default ActivityIcon;
