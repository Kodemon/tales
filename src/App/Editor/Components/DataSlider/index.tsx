import * as React from "react";
import { Handles, Rail as SliderRail, Tracks } from "react-compound-slider";
import { Container } from "../StackLayout/Styles";
import { Handle } from "./Handle";
import { Rail, Slider } from "./Styles";
import { Track } from "./Track";

export class DataSlider extends React.Component<
  {
    min: number;
    max: number;
    step: number;
    onFocus?: any;
    onBlur?: any;
    onUpdate?: any;
    onChange?: any;
    onSlideStart?: any;
    defaultValue: any;
  },
  { values: any; update: any }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      values: [this.props.defaultValue],
      update: [this.props.defaultValue]
    };
  }

  public onUpdate = (update: any) => {
    this.setState({ update });
    // Use the first value from the array because this only supports one handle
    console.log(update[0]);
    console.log("ou");
    if (this.state.values[0] !== update[0]) {
      this.props.onUpdate && this.props.onUpdate(update[0]);
    }
  };

  public onChange = (values: any) => {
    this.setState({ values });
    // Use the first value from the array because this only supports one handle
    // console.log(values[0]);
    // console.log("oc");
    // this.props.onChange && this.props.onChange(values[0]);
  };

  public onStart = (values: any) => {
    this.setState({ values });
    // Use the first value from the array because this only supports one handle
    console.log(values[0]);
    console.log("os");
    this.props.onSlideStart && this.props.onSlideStart(values[0]);
  };

  public static getDerivedStateFromProps(props: any, state: any) {
    // Need this to dynamically update state from props
    if (props.defaultValue !== state.values[0]) {
      return {
        values: [props.defaultValue]
      };
    }
    // Return null if the state hasn't changed
    return null;
  }

  public render() {
    const { values } = this.state;
    const { min, max, step, onFocus, onBlur, ...restProps } = this.props;
    return (
      <Container>
        <Slider mode={1} step={step} domain={[min, max]} onUpdate={this.onUpdate} onChange={this.onChange} onSlideStart={this.props.onSlideStart} values={values} {...restProps}>
          <SliderRail>{({ getRailProps }) => <Rail {...getRailProps()} />}</SliderRail>
          <Handles>
            {({ handles, getHandleProps }) => (
              <div className="slider-handles">
                {handles.map(handle => (
                  <Handle key={handle.id} handle={handle} domain={[this.props.min, this.props.max]} getHandleProps={getHandleProps} onFocus={onFocus} onBlur={onBlur} />
                ))}
              </div>
            )}
          </Handles>
          <Tracks right={false}>
            {({ tracks, getTrackProps }) => (
              <div>
                {tracks.map(({ id, source, target }) => (
                  <Track key={id} source={source} target={target} getTrackProps={getTrackProps} />
                ))}
              </div>
            )}
          </Tracks>
        </Slider>
      </Container>
    );
  }
}
