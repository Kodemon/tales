import { Source } from "Engine/Enums";
import * as React from "react";
import { SettingGroup } from "../Styles";

export class DataSetting extends React.Component<{
  entity: any;

  // ### Form Settings

  type: "input" | "checkbox" | "select";
  label: string;
  options?: SelectOption[];
  placeholder?: string;

  // Data Settings

  attr: string;
  fallback?: any;

  // ### Event Parsers

  onValue?: (value: any) => any;
  onChange?: (value: any) => any;
}> {
  private current: any;

  public shouldComponentUpdate() {
    const { entity, attr, fallback, onValue } = this.props;
    const fallbackValue = fallback !== undefined ? fallback : "";
    const value = onValue ? onValue(entity.get(attr, fallbackValue)) : entity.get(attr, fallbackValue);
    if (value !== this.current) {
      this.current = value;
      return true;
    }
    return false;
  }

  public render() {
    const { entity, type, label, attr, fallback, options, placeholder, onValue, onChange } = this.props;
    const fallbackValue = fallback !== undefined ? fallback : "";
    switch (type) {
      case "input": {
        return (
          <SettingGroup>
            <label className="input">{label}</label>
            <input
              type="text"
              value={onValue ? onValue(entity.get(attr, fallbackValue)) : entity.get(attr, fallbackValue)}
              placeholder={placeholder || ""}
              onChange={event => {
                entity.set(attr, onChange ? onChange(event.target.value) : event.target.value, Source.User);
              }}
            />
          </SettingGroup>
        );
      }
      case "checkbox": {
        return (
          <SettingGroup>
            <label className="input">{label}</label>
            <input
              type="checkbox"
              value={entity.get(attr, false)}
              onChange={event => {
                entity.set(attr, event.target.checked, Source.User);
              }}
            />
          </SettingGroup>
        );
      }
      case "select": {
        return (
          <SettingGroup>
            <label className="input">{label}</label>
            <select
              value={onValue ? onValue(entity.get(attr, fallbackValue)) : entity.get(fallbackValue)}
              onChange={event => {
                entity.set(attr, onChange ? onChange(event.target.value) : event.target.value, Source.User);
              }}
            >
              {(options || []).map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </SettingGroup>
        );
      }
    }
  }
}

/*
 |--------------------------------------------------------------------------------
 | Interfaces
 |--------------------------------------------------------------------------------
 */

interface SelectOption {
  label: string;
  value: any;
}
