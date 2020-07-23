import React, { Component } from 'react';
import { Label, Icon } from 'semantic-ui-react';

class MemberOccupations extends Component {
 
  render() {
    return this.props.occupations.map((occupation, index) => {
      return (
        <Label 
            as= 'a' 
            key={occupation}
            onClick={() => this.props.clicked(index)}            
        >
            {occupation}
            <Icon name='delete' />
        </Label>        
      );
    });
  }
}

export default MemberOccupations;
