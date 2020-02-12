import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import RawCloseIcon from './close.svg'

const Root = styled.span`
  display: inline-flex;
  align-items: center;
  background-color: lightgrey;
  padding: 5px 3px;
  border-radius: 8px;
  cursor: pointer;
`

const CloseIcon = styled(RawCloseIcon)`
  width: 14px;
  height: 14px;
  margin: 0 3px;
`

const SelectedValueChip = ({ value, onClick }) => {
  const [showRemoveButton, setShowRemoveButton] = useState()

  return (
    <Root
      onMouseEnter={_ => setShowRemoveButton(true)}
      onMouseLeave={_ => setShowRemoveButton(false)}
      onClick={onClick}
    >
      {value}
      {showRemoveButton && <CloseIcon />}
    </Root>
  )
}

SelectedValueChip.propTypes = {
  value: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
}

export default SelectedValueChip
