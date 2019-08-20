import * as React from "react";

export class Text extends React.Component<
  {
    value: string | number;
    onFocus?: any;
    onBlur?: any;
    onChange?: any;
    children: any;
  },
  {
    isFocused: boolean;
    value: any;
  }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      isFocused: false,
      value: this.props.value
    };
  }

  public componentWillReceiveProps({ value }: { value: any }) {
    this.setState(() => ({ value }));
  }

  public handleFocus = (evt: any) => {
    evt.persist();
    if (this.props.onFocus) {
      this.props.onFocus(evt);
    }
    this.setState(() => ({ isFocused: true }));
  };

  public handleBlur = (evt: any) => {
    evt.persist();

    if (this.props.onBlur) {
      this.props.onBlur(evt);
    }
    this.setState(() => ({ isFocused: false }));
  };

  public handleChange = (evt: any) => {
    evt.persist();

    const { value } = evt.target;
    if (this.props.onChange) {
      this.props.onChange(evt);
    }
    this.setState(() => ({ value }));
  };

  public render() {
    const { isFocused } = this.state;
    const value = isFocused ? this.state.value : this.props.value;

    return this.props.children({
      value,
      onFocus: this.handleFocus,
      onBlur: this.handleBlur,
      onChange: this.handleChange
    });
  }
}
