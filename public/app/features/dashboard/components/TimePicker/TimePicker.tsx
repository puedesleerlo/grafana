import React, { PureComponent, createRef } from 'react';
import moment from 'moment';
import {
  TimeRange,
  TimeOptions,
  TimeOption,
  SelectOptionItem,
  ClickOutsideWrapper,
  SelectButton,
  HeadlessSelect,
} from '@grafana/ui';
import Popper from '@grafana/ui/src/components/Tooltip/Popper';

import { TimePickerOptionGroup } from './TimePickerOptionGroup';
import { TimePickerPopOver } from './TimePickerPopOver';
import { mapTimeOptionToTimeRange, mapTimeRangeToRangeString } from './time';

export interface Props {
  value: TimeRange;
  isTimezoneUtc: boolean;
  popOverTimeOptions: TimeOptions;
  selectTimeOptions: TimeOption[];
  timezone?: string;
  onChange: (timeRange: TimeRange) => void;
  onMoveBackward: () => void;
  onMoveForward: () => void;
  onZoom: () => void;
}

export interface State {
  isPopOverOpen: boolean;
  isSelectOpen: boolean;
  isSmallScreen: boolean;
}

export class TimePicker extends PureComponent<Props, State> {
  pickerTriggerRef = createRef<HTMLDivElement>();
  state = { isSelectOpen: false, isPopOverOpen: false, isSmallScreen: false };

  componentWillMount() {
    this.setIsSmallScreen();
    window.addEventListener('resize', this.setIsSmallScreen);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setIsSmallScreen);
  }

  setIsSmallScreen = () => {
    this.setState({ isSmallScreen: window.innerWidth <= 1116 });
  };

  mapTimeOptionsToSelectOptionItems = (selectTimeOptions: TimeOption[]) => {
    const options = selectTimeOptions.map(timeOption => {
      return { label: timeOption.display, value: timeOption };
    });

    return [{ label: 'Custom', expanded: true, options, onCustomClick: (ref: any) => this.onCustomClicked() }];
  };

  onSelectButtonClicked = () => {
    this.setState({ isSelectOpen: !this.state.isSelectOpen, isPopOverOpen: false });
  };

  onSelectChanged = (item: SelectOptionItem) => {
    const { isTimezoneUtc, onChange, timezone } = this.props;
    this.setState({ isSelectOpen: !this.state.isSelectOpen, isPopOverOpen: false });
    onChange(mapTimeOptionToTimeRange(item.value, isTimezoneUtc, timezone));
  };

  onCustomClicked = () => {
    const { isSmallScreen } = this.state;
    this.setState({ isSelectOpen: isSmallScreen ? false : true, isPopOverOpen: true });
  };

  onClickOutside = () => {
    if (!this.state.isPopOverOpen) {
      this.setState({ isSelectOpen: false });
    }
  };

  render() {
    const { selectTimeOptions, onChange, value, onMoveBackward, onMoveForward, onZoom } = this.props;
    const { isSelectOpen, isPopOverOpen, isSmallScreen } = this.state;
    const options = this.mapTimeOptionsToSelectOptionItems(selectTimeOptions);
    const popover = TimePickerPopOver;
    const popoverElement = React.createElement(popover, {
      ...this.props,
      onChange: (timeRange: TimeRange) => {
        onChange(timeRange);
        this.setState({ isPopOverOpen: false });
      },
    });
    const rangeString = mapTimeRangeToRangeString(value);
    const isAbsolute = moment.isMoment(value.raw.to);

    return (
      <ClickOutsideWrapper onClick={this.onClickOutside}>
        <div className="time-picker">
          <div className="time-picker-buttons">
            {isAbsolute && (
              <button className="btn navbar-button navbar-button--tight" onClick={onMoveBackward}>
                <i className="fa fa-chevron-left" />
              </button>
            )}
            <SelectButton
              onClick={this.onSelectButtonClicked}
              textWhenUndefined={'NaN'}
              value={rangeString}
              iconClass={'fa fa-clock-o'}
            />
            {isAbsolute && (
              <button className="btn navbar-button navbar-button--tight" onClick={onMoveForward}>
                <i className="fa fa-chevron-right" />
              </button>
            )}
            <button className="btn navbar-button navbar-button--zoom" onClick={onZoom}>
              <i className="fa fa-search-minus" />
            </button>
          </div>

          <div className="time-picker-select" ref={this.pickerTriggerRef}>
            <HeadlessSelect
              components={{ Group: TimePickerOptionGroup }}
              isOpen={isSelectOpen}
              onChange={this.onSelectChanged}
              options={options}
            />
          </div>
          <div>
            {this.pickerTriggerRef.current && (
              <Popper
                show={isPopOverOpen}
                content={popoverElement}
                referenceElement={this.pickerTriggerRef.current}
                placement={isSmallScreen ? 'auto' : 'left-start'}
              />
            )}
          </div>
        </div>
      </ClickOutsideWrapper>
    );
  }
}
