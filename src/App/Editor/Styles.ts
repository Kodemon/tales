import styled from "styled-components";

import { Color, Font } from "../Variables";

export const Wrapper = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-rows: auto 1fr;
  grid-template-areas: "navbar navbar sidebar" "navigation content sidebar";

  background: #f2f2f2;
  width: 100%;
  height: 100%;

  i {
    color: #767676;
  }
`;

/*
 |--------------------------------------------------------------------------------
 | Editor Styles
 |--------------------------------------------------------------------------------
 */

export const SettingSidebar = styled.div`
  background: #f6f6f6;
  border-left: 1px solid #ccc;
  font-family: "Roboto", sans-serif;

  .sketch-picker {
    background: transparent !important;
    box-shadow: none !important;
  }
`;

/*
 |--------------------------------------------------------------------------------
 | General Styles
 |--------------------------------------------------------------------------------
 */

export const Header = styled.header`
  position: relative;
  border-bottom: 1px dashed #ccc;
  font-size: 13px;
  padding: 10px;

  > h1 {
    font-size: 13px;
  }
`;

/*
 |--------------------------------------------------------------------------------
 | Form Styles
 |--------------------------------------------------------------------------------
 */

export const SettingGroup = styled.div<{ columns?: string }>`
  display: grid;
  grid-template-columns: ${props => props.columns || "44px auto"};
  gap: 8px 8px;
  align-items: center;

  font-size: ${Font.Size};
  padding: 4px 0;

  > label,
  > div {
    color: ${Color.Font};
  }

  > input,
  select {
    background: ${Color.BackgroundDark};
    border: 1px solid ${Color.Border};
    color: ${Color.Font};
    font-size: ${Font.Size};
    padding: 4px;

    width: 100%;
    height: 24px;

    &:focus {
      outline: 1px solid ${Color.BackgroundBlue};
    }
  }

  > input {
    background: ${Color.BackgroundDark};
  }

  > select {
    background: ${Color.BackgroundLight};
  }
`;

export const SettingGroupStacked = styled.div`
  display: grid;
  grid-template-rows: 20px auto;
  gap: 8px 8px;
  align-items: center;

  font-size: ${Font.Size};
  padding: 4px 0;

  .header {
    display: grid;
    grid-template-columns: 10px auto;
    align-content: center;

    > i {
      display: block;
    }
  }
`;

/*
 |--------------------------------------------------------------------------------
 | Categories
 |--------------------------------------------------------------------------------
 */

export const Categories = styled.div`
  height: 100vh;
  overflow-x: hidden;
  overflow-y: scroll;
`;

export const Category = styled.div``;

export const CategoryHeader = styled.div`
  display: grid;
  grid-template-columns: 15px auto auto;
  align-content: center;

  background: ${Color.BackgroundDark};
  border-top: 1px solid ${Color.Border};
  color: ${Color.Font};

  &.blue {
    background: ${Color.BackgroundBlue};
    border-top: 1px solid ${Color.BorderLightBlue};
    border-bottom: 1px solid ${Color.BorderDarkBlue};
    color: ${Color.FontLight};
    i {
      color: ${Color.FontLight};
    }
  }

  div {
    padding: 8px;
  }

  .caret {
    font-size: 12px;
  }

  .header {
    font-family: -apple-system, BlinkMacSystemFont, proxima-nova, Roboto, Arial, sans-serif, Georgia, serif;
    font-size: 12px;
    font-weight: bold;

    cursor: default;
  }

  .actions {
    text-align: right;
    i {
      display: inline-block;
      font-size: 12px;
      margin-right: 12px;

      &:last-child {
        margin-right: 4px;
      }

      &:hover {
        color: ${Color.FontLight};
        cursor: pointer;
      }

      &.grab {
        cursor: grab;
        &:active {
          cursor: grabbing;
        }
      }
    }
  }
`;

export const CategoryContent = styled.div`
  padding: 10px;
`;

/*
 |--------------------------------------------------------------------------------
 | Utils
 |--------------------------------------------------------------------------------
 */

export const Divider = styled.div`
  clear: both;
  height: 1px;
  line-height: 0;
  font-size: 0;
  border-top: 1px solid ${Color.BorderLight};
  margin: 8px 0;
`;

export const ActionGroup = styled.div`
  display: flex;
  height: 32px;
  padding: 4px;
  width: 100px;
  justify-content: space-evenly;
  align-content: space-between;
`;

export const ActionButton = styled.button`
  background: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  padding: 0 !important;
`;
