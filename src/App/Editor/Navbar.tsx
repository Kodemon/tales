import * as qrcode from "qrcode";
import * as React from "react";
import * as ReactDOM from "react-dom";
import styled from "styled-components";

import { Page } from "Engine/Page";

import { Color, Font } from "../Variables";

class QRCode extends React.Component<{
  page: Page;
  close: () => void;
}> {
  private canvas: any;

  public componentDidMount() {
    if (this.props.page.conduit) {
      qrcode.toCanvas(this.canvas, `https://tales.netlify.com/read/${this.props.page.id}?peer=${this.props.page.conduit.id}`, function(err: Error) {
        if (err) {
          console.error(err);
        }
        console.log("success!");
      });
    }
  }

  public render() {
    return (
      <Modal>
        <ModalContainer>
          <canvas ref={c => (this.canvas = c)} />
          <button onClick={this.props.close}>Close</button>
        </ModalContainer>
      </Modal>
    );
  }
}

const Modal = styled.div`
  display: grid;
  grid-template-columns: "1fr auto 1fr";
  grid-template-rows: "1fr auto 1fr";
  grid-template-areas: ". . ." ". modal ." ". . .";

  height: 100vh;
`;

const ModalContainer = styled.div`
  grid-area: modal;
  background: #fcfcfc;
`;

export class Navbar extends React.Component<
  {
    page: Page;
    ratio: any;
    edit: (section?: string, stack?: string, component?: string) => void;
    setRatio: (ratio: string) => void;
  },
  {
    connecting: boolean;
    qrcode: boolean;
  }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      connecting: false,
      qrcode: false
    };
  }

  private livePreview = () => {
    this.setState(
      () => ({ qrcode: true }),
      () => {
        document.getElementById("app")!.className = "blur";
      }
    );
  };

  private onClose = () => {
    this.setState(
      () => ({ qrcode: false }),
      () => {
        document.getElementById("app")!.className = "";
      }
    );
  };

  public render() {
    if (!this.props.page) {
      return <Container style={{ gridArea: "navbar" }} />;
    }
    return (
      <React.Fragment>
        <Container style={{ gridArea: "navbar" }}>
          <div className="left">
            <div style={{ textAlign: "center", width: 40, padding: "3px 0 0" }}>
              <img src="https://i.ibb.co/kxt8txt/tails-white-transparent-35x35.png" width="30" height="30" />
            </div>
            <div>
              {this.props.page.conduit ? (
                <div className="button">
                  <span>
                    <i className="fa fa-link" /> Peer ID | {this.props.page.conduit.id}
                  </span>
                </div>
              ) : this.state.connecting ? (
                <div className="button">
                  <span>
                    <i className="fa fa-link" /> Connecting...
                  </span>
                </div>
              ) : (
                <button
                  onClick={() => {
                    this.setState(
                      () => ({ connecting: true }),
                      () => {
                        this.props.page.share();
                      }
                    );
                  }}
                >
                  <i className="fa fa-link" /> Share
                </button>
              )}
            </div>
          </div>
          <div className="center">
            <div className={this.props.ratio.name === "" ? "active" : ""}>
              <button
                onClick={() => {
                  this.props.setRatio("");
                }}
              >
                <i className="fa fa-desktop" style={{ fontSize: 15, marginRight: 0 }} />
              </button>
            </div>
            <div className={this.props.ratio.name === "iPad Pro" ? "active" : ""}>
              <button
                onClick={() => {
                  this.props.setRatio("iPad Pro");
                }}
              >
                <i className="fa fa-tablet fa-rotate-270" style={{ fontSize: 19, marginRight: 0 }} />
              </button>
            </div>
            <div className={this.props.ratio.name === "iPad Pro Landscape" ? "active" : ""}>
              <button
                onClick={() => {
                  this.props.setRatio("iPad Pro Landscape");
                }}
              >
                <i className="fa fa-tablet" style={{ fontSize: 19, marginRight: 0 }} />
              </button>
            </div>
            <div className={this.props.ratio.name === "iPhone XR" ? "active" : ""}>
              <button
                onClick={() => {
                  this.props.setRatio("iPhone XR");
                }}
              >
                <i className="fa fa-mobile" style={{ fontSize: 20, marginRight: 0 }} />
              </button>
            </div>
          </div>
          <div className="right">
            <div>
              <button
                onClick={() => {
                  window.open(`/read/${this.props.page.id}`, "_blank");
                }}
              >
                <i className="fa fa-eye" /> Preview
              </button>
            </div>
            <div>
              <button onClick={this.livePreview}>
                <i className="fa fa-tablet" /> Live Preview
              </button>
            </div>
          </div>
        </Container>
        {this.state.qrcode && ReactDOM.createPortal(<QRCode page={this.props.page} close={this.onClose} />, document.getElementById("modal") as Element)}
      </React.Fragment>
    );
  }
}

/*
 |--------------------------------------------------------------------------------
 | Styled
 |--------------------------------------------------------------------------------
 */

const Container = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;

  background: ${Color.Background};
  border-bottom: 1px solid ${Color.Border};
  color: ${Color.Font};
  height: 35px;

  font-family: ${Font.Family};
  font-size: ${Font.Size};

  .left,
  .center,
  .right {
    > div {
      height: 35px;
      padding: 0 15px;

      &:hover {
        color: ${Color.FontLight};
      }

      &.active {
        background: ${Color.BackgroundLight};
        color: ${Color.FontLight};
      }
    }

    .button,
    button {
      background: none;
      border: none;
      color: inherit;
      height: 100%;
      font-size: ${Font.Size};

      &:active,
      &:visited,
      &:focus {
        outline: none;
      }

      > span {
        display: block;
        padding-top: 11px;
      }
    }

    i {
      color: inherit;
      margin-right: 5px;
    }
  }

  .left {
    display: flex;
    align-content: center;
    justify-content: flex-start;

    > div {
      border-right: 1px solid ${Color.BorderLight};
    }
  }

  .center {
    display: flex;
    align-content: center;
    justify-content: center;

    > div {
      border-left: 1px solid ${Color.BorderLight};
      &:last-child {
        border-right: 1px solid ${Color.BorderLight};
      }
    }
  }

  .right {
    display: flex;
    align-content: center;
    justify-content: flex-end;

    > div {
      border-left: 1px solid ${Color.BorderLight};
    }
  }
`;
