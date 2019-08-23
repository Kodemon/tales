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
    value: number;
    onChange?: any;
  },
  {
    value: number;
  }
> {
  private current: number;

  constructor(props: any) {
    super(props);
    this.state = {
      value: this.props.value
    };
  }

  public onUpdate = ([value]: number[]) => {
    if (typeof value === "number" && value !== this.current) {
      this.current = value;
      this.setState({ value });
      this.props.onChange(value);
    }
  };

  public static getDerivedStateFromProps(props: any, state: any) {
    if (props.value !== state.value) {
      return {
        value: props.value
      };
    }
    return null;
  }

  public render() {
    const value = this.state.value;
    const { min, max, step } = this.props;
    return (
      <Container>
        <Slider mode={1} step={step} domain={[min, max]} onUpdate={this.onUpdate} values={[value]}>
          <SliderRail>{({ getRailProps }: { getRailProps: any }) => <Rail {...getRailProps()} />}</SliderRail>
          <Handles>
            {({ handles, getHandleProps }: { handles: any; getHandleProps: any }) => (
              <div className="slider-handles">
                {handles.map((handle: any) => (
                  <Handle key={handle.id} handle={handle} domain={[this.props.min, this.props.max]} getHandleProps={getHandleProps} />
                ))}
              </div>
            )}
          </Handles>
          <Tracks right={false}>
            {({ tracks, getTrackProps }: { tracks: any; getTrackProps: any }) => (
              <div>
                {tracks.map(({ id, source, target }: { id: string; source: any; target: any }) => (
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
