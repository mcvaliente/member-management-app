import React, { Component } from "react";
import swal from "sweetalert";

class MemberInfo extends Component {
  componentDidMount() {
    console.log("Member to search: ", this.props.memberId);
  }

  searchMemberHandler() {
    //First, Check if the memberId is in the blockchain
    try {
      this.setState({ loading: true });
      //TODO: Redirect to the member page.
    } catch (error) {
      this.setState({ loading: false });
      swal({
        title: "Error",
        text: error.message,
        icon: "error",
        button: "Aceptar",
      });
    }
  }

  render() {
    return (
      <div
        className={
          this.state.loading ? "ui loading icon input" : "ui icon input"
        }
        style={{ marginLeft: "20px" }}
      >
        <input
          type="text"
          placeholder="Busca por NIF/NIE..."
          disabled={!this.props.metaMaskConnected}
          onKeyPress={this.keyPressHandler}
        />
        <i aria-hidden="true" className="search icon"></i>
        {this.state.memberId ? (
          <MemberInfo memberId={this.state.memberId} />
        ) : null}
      </div>
    );
  }
}

export default MemberInfo;
