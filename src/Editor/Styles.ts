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

/*
 |--------------------------------------------------------------------------------
 | Editor Styles
 |--------------------------------------------------------------------------------
 */

export const SectionSidebar = styled.div`
  background: #f6f6f6;
  border-right: 1px solid #ccc;
  font-family: "Roboto", sans-serif;

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
 | Content
 |--------------------------------------------------------------------------------
 */

export const Content = styled.div`
  position: relative;

  overflow-y: scroll;
  overflow-x: visible;
  -webkit-overflow-scrolling: touch;

  /*
  color: #303030;
  font-family: "Merriweather", serif;
  font-size: 1em;
  line-height: 1.77em;
  */
  text-rendering: optimizeLegibility;

  /* Position Classes */

  .section-relative {
    position: relative;
  }

  .section-absolute {
    position: absolute;
  }

  .section-sticky {
    position: -webkit-sticky;
    position: sticky;
    top: 0;
  }
  .section-sticky:before,
  .section-sticky:after {
    content: "";
    display: table;
  }

  /* Fixed Sticky */

  .component-absolute {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  .component-fixed_container {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    clip: rect(0, auto, auto, 0);
    /* clip-path: polygon(0px 0px, 0px 100%, 100% 100%, 100% 0px); */
  }

  .component-scroll_overlay {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  .component-fixed_component {
    position: fixed;
    top: 0;
  }

  /* Quill */

  .ql-container {
    font-family: "Merriweather", serif;
    font-size: 1em;

    &.ql-snow {
      border: none;
    }
  }

  .ql-editor {
    line-height: 1.77em;
  }

  .ql-toolbar {
    display: none;
  }

  .ql-blank::before {
    left: auto;
    right: auto;
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
