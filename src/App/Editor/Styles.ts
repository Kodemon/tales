import styled from "styled-components";

import { Color, Font } from "../Variables";

export const Wrapper = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-rows: 1fr;

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

export const SettingGroup = styled.div`
  display: grid;
  grid-template-columns: 44px auto;
  gap: 8px 8px;
  align-items: center;

  font-size: ${Font.Size};
  padding: 4px 0;

  > input,
  select {
    background: ${Color.BackgroundDark};
    border: 1px solid ${Color.Border};
    color: ${Color.Font};
    font-size: ${Font.Size};
    padding: 4px;

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
