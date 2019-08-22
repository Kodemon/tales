import styled from "styled-components";

export const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 40px auto 364px;
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
  grid-template-columns: 30% auto;
  grid-template-rows: 1fr;

  margin-bottom: 5px;

  > label {
    font-size: 13px;
    &.input {
      padding-top: 2px;
    }
  }

  > input {
    &[type="checkbox"] {
      margin-top: 3px;
    }
  }

  .read {
    font-size: 13px;
  }
`;

export const SettingGroupStacked = styled.div`
  > label {
    display: block;
    font-size: 13px;
    margin-bottom: 10px;
    &.input {
      padding-top: 2px;
    }
  }
`;
