import {createSelector} from 'reselect';
import {IAllReducerProps} from './types';

export function store2Props({indexMain}: any): IAllReducerProps {
  return {
    main: indexMain,
  };
}

//衍生数据使用请参考:  https://github.com/reduxjs/reselect
