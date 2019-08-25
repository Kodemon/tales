import styled from "styled-components";

export const Viewport = styled.div`
  position: relative;
  grid-area: viewport;

  background: #f6f6f6;
  border: 1px solid #57b3e4;

  overflow-y: scroll;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;

  text-rendering: optimizeLegibility;

  /* Position Classes */

  .position-relative {
    position: relative;
  }

  .position-absolute {
    position: absolute;
  }

  .position-sticky {
    position: -webkit-sticky;
    position: sticky;
    top: 0;
  }
  .position-sticky:before,
  .position-sticky:after {
    content: "";
    display: table;
  }

  /* Fixed Sticky */

  .position-fixed {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  .position-fixed_container {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    clip: rect(0, auto, auto, 0);
    /* clip-path: polygon(0px 0px, 0px 100%, 100% 100%, 100% 0px); */
  }

  .position-scroll_overlay {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  .position-fixed_component {
    position: fixed;
    top: 0;
  }

  /* Flex */

  .display-flex {
    display: -webkit-flex; /* Safari */
    display: flex;
  }

  /* Quill */

  .ql-container {
    font-family: "Merriweather", serif;
    font-size: 1em;
    height: auto;
  }

  .ql-editor {
    line-height: inherit;
    overflow: visible;
    height: auto;
  }

  .ql-tooltip {
    border-radius: 3px;
  }

  .ql-blank::before {
    left: auto;
    right: auto;
  }
`;
