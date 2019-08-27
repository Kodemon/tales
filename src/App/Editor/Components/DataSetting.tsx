import * as React from "react";
import styled from "styled-components";

import { Source } from "Engine/Enums";

import { Color } from "../../Variables";
import { SettingGroup } from "../Styles";
import { DataSlider } from "./DataSlider/index";

export class DataSetting extends React.Component<{
  entity: any;

  // ### Form Settings

  type: "input" | "checkbox" | "select" | "slider" | "position";
  label?: string;
  options?: SelectOption[] | MinMax;
  placeholder?: string;

  // Data Settings

  attr: string;
  fallback?: any;

  // ### Options

  // ### Event Parsers

  onValue?: (value: any) => any;
  onChange?: (value: any) => any;
  onDrop?: (event: React.DragEvent<HTMLInputElement>) => any;
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
              onDrop={this.props.onDrop}
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
              value={onValue ? onValue(entity.get(attr, fallbackValue)) : entity.get(attr, fallbackValue)}
              onChange={event => {
                entity.set(attr, onChange ? onChange(event.target.value) : event.target.value, Source.User);
              }}
            >
              {((options as SelectOption[]) || []).map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </SettingGroup>
        );
      }
      case "slider": {
        return (
          <SettingGroup columns="44px auto 44px">
            <label className="input">{label}</label>
            <DataSlider
              min={(options as MinMax).min}
              max={(options as MinMax).max}
              step={1}
              value={entity.get(attr, fallbackValue)}
              onChange={(value: number) => {
                entity.set(attr, String(value), Source.User);
              }}
            />
            <input
              type="text"
              value={onValue ? onValue(entity.get(attr, fallbackValue)) : entity.get(attr, fallbackValue)}
              placeholder={placeholder || ""}
              onChange={event => {
                entity.set(attr, event.target.value, Source.User);
              }}
            />
          </SettingGroup>
        );
      }
      case "position": {
        return (
          <SettingGroup>
            <label />
            <PositionSelectors>
              <PositionTopLeft entity={this.props.entity} attr={attr} value={entity.get(attr)} />
              <PositionTopRight entity={this.props.entity} attr={attr} value={entity.get(attr)} />
              <PositionBottomLeft entity={this.props.entity} attr={attr} value={entity.get(attr)} />
              <PositionBottomRight entity={this.props.entity} attr={attr} value={entity.get(attr)} />

              <PositionLeft entity={this.props.entity} attr={attr} value={entity.get(attr)} />
              <PositionRight entity={this.props.entity} attr={attr} value={entity.get(attr)} />
              <PositionBottom entity={this.props.entity} attr={attr} value={entity.get(attr)} />
              <PositionTop entity={this.props.entity} attr={attr} value={entity.get(attr)} />

              <PositionReset entity={this.props.entity} attr={attr} />
            </PositionSelectors>
          </SettingGroup>
        );
      }
    }
  }
}

/*
 |--------------------------------------------------------------------------------
 | Components
 |--------------------------------------------------------------------------------
 */

function PositionTopLeft({ entity, attr, value }: any) {
  const isActive = value === "top left";
  return (
    <PositionSelector
      className={isActive ? "active" : ""}
      onClick={() => {
        entity.set(attr, "top left", Source.User);
      }}
    >
      <svg data-icon="position-topleft" aria-hidden="true" focusable="false" width="15" height="15" viewBox="0 0 15 15" style={{ display: "block", transform: "translate(0px, 0px)" }}>
        <path fill="currentColor" d="M3 3h4v4H3z"></path>
        <path opacity=".3" fill="currentColor" d="M2 13V2h11v11H2M14 1H1v13h13V1" />
      </svg>
    </PositionSelector>
  );
}

function PositionTopRight({ entity, attr, value }: any) {
  const isActive = value === "top right";
  return (
    <PositionSelector
      className={isActive ? "active" : ""}
      onClick={() => {
        entity.set(attr, "top right", Source.User);
      }}
    >
      <svg data-icon="position-topright" aria-hidden="true" focusable="false" width="15" height="15" viewBox="0 0 15 15" style={{ display: "block", transform: "translate(0px, 0px)" }}>
        <path fill="currentColor" d="M8 3h4v4H8z"></path>
        <path opacity=".3" fill="currentColor" d="M2 13V2h11v11H2M14 1H1v13h13V1"></path>
      </svg>
    </PositionSelector>
  );
}

function PositionBottomLeft({ entity, attr, value }: any) {
  const isActive = value === "bottom left";
  return (
    <PositionSelector
      className={isActive ? "active" : ""}
      onClick={() => {
        entity.set(attr, "bottom left", Source.User);
      }}
    >
      <svg
        data-icon="position-bottom-left"
        aria-hidden="true"
        focusable="false"
        width="15"
        height="15"
        viewBox="0 0 15 15"
        style={{ display: "block", transform: "translate(0px, 0px)" }}
      >
        <path fill="currentColor" d="M3 8h4v4H3z"></path>
        <path opacity=".3" fill="currentColor" d="M2 13V2h11v11H2M14 1H1v13h13V1"></path>
      </svg>
    </PositionSelector>
  );
}

function PositionBottomRight({ entity, attr, value }: any) {
  const isActive = value === "bottom right";
  return (
    <PositionSelector
      className={isActive ? "active" : ""}
      onClick={() => {
        entity.set(attr, "bottom right", Source.User);
      }}
    >
      <svg
        data-icon="position-bottom right"
        aria-hidden="true"
        focusable="false"
        width="15"
        height="15"
        viewBox="0 0 15 15"
        style={{ display: "block", transform: "translate(0px, 0px)" }}
      >
        <path fill="currentColor" d="M8 8h4v4H8z"></path>
        <path opacity=".3" fill="currentColor" d="M2 13V2h11v11H2M14 1H1v13h13V1"></path>
      </svg>
    </PositionSelector>
  );
}

function PositionLeft({ entity, attr, value }: any) {
  const isActive = value === "left";
  return (
    <PositionSelector
      className={isActive ? "active" : ""}
      onClick={() => {
        entity.set(attr, "left", Source.User);
      }}
    >
      <svg data-icon="position-left" aria-hidden="true" focusable="false" width="15" height="15" viewBox="0 0 15 15" style={{ display: "block", transform: "translate(0px, 0px)" }}>
        <path fill="currentColor" d="M3 3h4v9H3z"></path>
        <path opacity=".3" fill="currentColor" d="M2 13V2h11v11H2M14 1H1v13h13V1"></path>
      </svg>
    </PositionSelector>
  );
}

function PositionRight({ entity, attr, value }: any) {
  const isActive = value === "right";
  return (
    <PositionSelector
      className={isActive ? "active" : ""}
      onClick={() => {
        entity.set(attr, "right", Source.User);
      }}
    >
      <svg data-icon="position-right" aria-hidden="true" focusable="false" width="15" height="15" viewBox="0 0 15 15" style={{ display: "block", transform: "translate(0px, 0px)" }}>
        <path fill="currentColor" d="M8 3h4v9H8z"></path>
        <path opacity=".3" fill="currentColor" d="M2 13V2h11v11H2M14 1H1v13h13V1"></path>
      </svg>
    </PositionSelector>
  );
}

function PositionBottom({ entity, attr, value }: any) {
  const isActive = value === "bottom center";
  return (
    <PositionSelector
      className={isActive ? "active" : ""}
      onClick={() => {
        entity.set(attr, "bottom center", Source.User);
      }}
    >
      <svg data-icon="position-bottom" aria-hidden="true" focusable="false" width="15" height="15" viewBox="0 0 15 15" style={{ display: "block", transform: "translate(0px, 0px)" }}>
        <path fill="currentColor" d="M3 8h9v4H3z"></path>
        <path opacity=".3" fill="currentColor" d="M2 13V2h11v11H2M14 1H1v13h13V1"></path>
      </svg>
    </PositionSelector>
  );
}

function PositionTop({ entity, attr, value }: any) {
  const isActive = value === "top center";
  return (
    <PositionSelector
      className={isActive ? "active" : ""}
      onClick={() => {
        entity.set(attr, "top center", Source.User);
      }}
    >
      <svg data-icon="position-top" aria-hidden="true" focusable="false" width="15" height="15" viewBox="0 0 15 15" style={{ display: "block", transform: "translate(0px, 0px)" }}>
        <path fill="currentColor" d="M3 3h9v4H3z"></path>
        <path opacity=".3" fill="currentColor" d="M2 13V2h11v11H2M14 1H1v13h13V1"></path>
      </svg>
    </PositionSelector>
  );
}

function PositionReset({ entity, attr }: any) {
  return (
    <PositionSelector
      onClick={() => {
        console.log("SET ATTRIBUTE");
        entity.set(attr, "center center", Source.User);
      }}
    >
      <svg data-icon="position-all" aria-hidden="true" focusable="false" width="15" height="15" viewBox="0 0 15 15" style={{ display: "block", transform: "translate(0px, 0px)" }}>
        <g fill="currentColor">
          <path d="M3 3h9v9H3z"></path>
          <path opacity=".3" d="M2 13V2h11v11H2M14 1H1v13h13V1"></path>
        </g>
      </svg>
    </PositionSelector>
  );
}

/*
 |--------------------------------------------------------------------------------
 | Styled
 |--------------------------------------------------------------------------------
 */

export const DataGroup = styled.div`
  display: grid;

  grid-template-columns: 1fr 1fr;
  gap: 8px;

  width: 326px;
`;

const PositionSelectors = styled.div`
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  gap: 5px;
`;

const PositionSelector = styled.div`
  padding: 5px 3px;

  &:hover {
    background: ${Color.BackgroundLight};
    cursor: pointer;
  }

  &.active {
    background: ${Color.BackgroundDark};
  }

  > svg {
    margin: 0 auto;
  }
`;

/*
 |--------------------------------------------------------------------------------
 | Interfaces
 |--------------------------------------------------------------------------------
 */

interface SelectOption {
  label: string;
  value: any;
}

interface MinMax {
  min: number;
  max: number;
}
