import * as React from "react";
import * as ReactDOM from "react-dom";
import styled from "styled-components";

let openModal: any;
let closeModal: any;

export const modal = {
  /**
   * Add provided component to the modal, and renders it.
   *
   * @param component
   */
  open(component: JSX.Element): void {
    if (typeof openModal === "function") {
      openModal(component);
    }
  },

  /**
   * Close the current modal.
   */
  close(): void {
    if (typeof closeModal === "function") {
      closeModal();
    }
  },

  /**
   * Renders the portal container.
   *
   * @returns {JSX.Element}
   */
  render(): JSX.Element {
    return <Modal />;
  }
};

/*
 |--------------------------------------------------------------------------------
 | Modal Component
 |--------------------------------------------------------------------------------
 */

class Modal extends React.Component<
  {},
  {
    modal?: JSX.Element;
  }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      modal: undefined
    };
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
  }

  public componentDidMount() {
    openModal = this.open;
    closeModal = this.close;
  }

  public componentWillUnmount() {
    openModal = undefined;
    closeModal = undefined;
  }

  /*
   |--------------------------------------------------------------------------------
   | Actions
   |--------------------------------------------------------------------------------
   */

  /**
   * Open a modal with the provided component.
   *
   * @param component
   */
  public open(component: JSX.Element): void {
    this.setState(
      () => ({
        modal: component
      }),
      () => {
        document.getElementById("app")!.className = "blur";
      }
    );
  }

  /**
   * Close the current modal.
   */
  public close(): void {
    this.setState(
      () => ({ modal: undefined }),
      () => {
        document.getElementById("app")!.className = "";
      }
    );
  }

  /*
   |--------------------------------------------------------------------------------
   | Renderer
   |--------------------------------------------------------------------------------
   */

  public render() {
    const modal = this.state.modal;
    if (!modal) {
      return null;
    }
    return ReactDOM.createPortal(
      <React.Fragment>
        <CloseOverlay />
        <ModalGrid>
          <ModalContainer>{modal}</ModalContainer>
        </ModalGrid>
      </React.Fragment>,
      document.getElementById("modal") as Element
    );
  }
}

/*
 |--------------------------------------------------------------------------------
 | Modal Close Component
 |--------------------------------------------------------------------------------
*/

export const CloseOverlay: React.SFC = function CloseOverlay() {
  return <ModalOverlay onClick={() => modal.close()} />;
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  background: rgba(25, 25, 25, 0.1);

  z-index: 20;
`;

/*
 |--------------------------------------------------------------------------------
 | Styles
 |--------------------------------------------------------------------------------
 */

export const ModalGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  grid-template-rows: 1fr auto 1fr;
  grid-template-areas: ". . ." ". modal ." ". . .";

  position: relative;

  min-height: 100vh;

  z-index: 4;
`;

export const ModalContainer = styled.div`
  grid-area: modal;
  background: #fcfcfc;
  border-radius: 3px;
`;
