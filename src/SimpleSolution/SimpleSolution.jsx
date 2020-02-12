import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import debounce from 'lodash.debounce'

import Suggestion from './Suggestion'
import doFetchSuggestions from '../fetchSuggestions'

const WIDTH = '400px'
const SUGGESTIONS_DEBOUNCE_TIMEOUT = 200

const Root = styled.div`
  font-family: 'Helvetica';
  display: flex;
  flex-direction: column;
  align-items: center;
`

const InputWrapper = styled.div`
  position: relative;
  width: ${WIDTH};
`

const Input = styled.input`
  height: 24px;
  width: 100%;
  margin-bottom: 16px;
  border: 1px solid lightgrey;
`

const SuggestionsBox = styled.div`
  position: absolute;
  top: 24px;
  width: 100%;
  max-height: 400px;
  overflow-y: scroll;
  background-color: white;
  border: 1px solid lightgrey;

  > :not(:last-child) {
    border-bottom: 1px solid lightgrey;
  }
`

const SimpleSolution = _props => {
  const [suggestions, setSuggestions] = useState([])

  const fetchSuggestions = useCallback(
    debounce(async filter => {
      try {
        const suggestions = await doFetchSuggestions(filter)
        setSuggestions(suggestions)
      } catch (_error) { } // eslint-disable-line no-empty
    }, SUGGESTIONS_DEBOUNCE_TIMEOUT)
  )

  return (
    <Root>
      <h4>Select your favorite cities</h4>

      <InputWrapper>
        <Input onChange={ev => fetchSuggestions(ev.target.value)} />

        {suggestions.length > 0 && (
          <SuggestionsBox>
            {suggestions.map((s, index) => (<Suggestion key={s.geonameid} city={s} />))}
          </SuggestionsBox>
        )}
      </InputWrapper>
    </Root>
  )
}

export default SimpleSolution
