import React from 'react'
import { Button, Modal } from 'semantic-ui-react'

const SmartAlert = (props) => (
  <Modal
    trigger={<Button>Show Modal</Button>}
    content={props.message}
    actions={{ key: 'done', content: 'Done', positive: true }}
  />
)

export default SmartAlert;
