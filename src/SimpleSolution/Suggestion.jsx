import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Root = styled.div`
  display: flex;
  align-items: center;
`

const CheckboxWrapper = styled.div`
  padding: 16px;
`

const Caption = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`

const Country = styled.strong``
const SubCountryAndName = styled.div``

const Suggestion = ({ city: { country, subcountry, name } }) => {
  return (
    <Root>
      <CheckboxWrapper>
        <input type='checkbox' />
      </CheckboxWrapper>
      <Caption>
        <Country>
          {country}
        </Country>
        <SubCountryAndName>
          {subcountry} - {name}
        </SubCountryAndName>
      </Caption>
    </Root>
  )
}

Suggestion.propTypes = {
  city: PropTypes.shape({
    country: PropTypes.string.isRequired,
    subcountry: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired
}

export default Suggestion
