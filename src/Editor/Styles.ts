import styled from "styled-components";

export const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 240px auto 280px;
  grid-template-rows: 1fr;
  width: 100%;
  height: 100%;

  i {
    color: #767676;
  }
`;

export const Header = styled.header`
  position: relative;
  border-bottom: 1px solid #ccc;
  font-size: 13px;
  padding: 10px;

  > h1 {
    font-size: 13px;
    font-weight: 500;
  }
`;

export const Scenes = styled.div`
  background: #f6f6f6;
  border-right: 1px solid #ccc;

  header {
    > div {
      position: absolute;
      top: 6px;
      right: 10px;

      button {
        cursor: pointer;
        margin: 0 3px;
        padding: 3px;
      }
    }
  }
`;

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

export const Content = styled.div`
  position: relative;
  overflow-y: scroll;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
`;

export const Settings = styled.div`
  background: #f6f6f6;
  border-left: 1px solid #ccc;
`;
