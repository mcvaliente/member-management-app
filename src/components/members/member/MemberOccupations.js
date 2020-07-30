import React from "react";
import { Label, Icon } from "semantic-ui-react";

//Using Hooks.
export default function MemberOccupations(props) {
  return props.occupations.map((occupation, index) => {
    return (
      <Label as="a" key={occupation} onClick={() => props.clicked(index)}>
        {occupation}
        <Icon name="delete" />
      </Label>
    );
  });
}
