import React, { useState, forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import RawCheckboxIcon from './check-box.svg'
import RawCheckboxCheckedIcon from './check-box-checked.svg'

const CHECKBOX_SIZE = '16px'

const Root = styled.div`
  display: flex;
  align-items: center;

  &:not(:last-child) {
    border-bottom: 1px solid lightgrey;
  }

  background-color: ${props => props.focused ? 'lightgrey' : 'white'};
  cursor: pointer;
`

const IconWrapper = styled.div`
  margin-left: 16px;
`

const CheckboxIcon = styled(RawCheckboxIcon)`
  width: ${CHECKBOX_SIZE};
  height: ${CHECKBOX_SIZE};
`

const CheckboxCheckedIcon = styled(RawCheckboxCheckedIcon)`
  width: ${CHECKBOX_SIZE};
  height: ${CHECKBOX_SIZE};
`

const Caption = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 16px;
  padding: 8px 0;
`

const CaptionTop = styled.div`
  font-weight: bold;
`

const CaptionBottom = styled.div``

const Suggestion = forwardRef(({ checked, focused: forceFocused, onClick, onMouseDown, country, subcountry, name }, ref) => {
  const [focused, setFocused] = useState(false)

  return (
    <Root
      ref={ref}
      onClick={onClick}
      onMouseEnter={_ => setFocused(true)}
      onMouseLeave={_ => setFocused(false)}
      onMouseDown={onMouseDown}
      focused={forceFocused || focused}
    >
      <IconWrapper>
        {checked ? <CheckboxCheckedIcon /> : <CheckboxIcon />}
      </IconWrapper>
      <Caption>
        <CaptionTop>{country}</CaptionTop>
        <CaptionBottom>{subcountry} - {name}</CaptionBottom>
      </Caption>
    </Root>
  )
})

Suggestion.propTypes = {
  checked: PropTypes.bool,
  focused: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  onMouseDown: PropTypes.func.isRequired,
  country: PropTypes.string.isRequired,
  subcountry: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
}

Suggestion.displayName = 'Suggestion'

export default Suggestion
