import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import debounce from 'lodash.debounce'
import scrollIntoView from 'scroll-into-view-if-needed'

import RawFilterIcon from './filter.svg'
import doFetchSuggestions from '../fetchSuggestions'
import Suggestion from './Suggestion'
import SelectedValueChip from './SelectedValueChip'

const WIDTH = '400px'
const FETCH_SUGGESTIONS_DEBOUNCE_TIMEOUT = 200

// Shameless copy/paste to have cross-browser element focus that works, because plain .focus() does not work
// https://stackoverflow.com/questions/30376628/how-to-trigger-focus-event-on-a-textbox-using-javascript
const triggerFocus = element => {
  const eventType = 'onfocusin' in element ? 'focusin' : 'focus'
  const bubbles = 'onfocusin' in element
  let event

  if ('createEvent' in document) {
    event = document.createEvent('Event');
    event.initEvent(eventType, bubbles, true);
  } else if ('Event' in window) {
    event = new Event(eventType, { bubbles, cancelable: true });
  }

  element.focus()
  element.dispatchEvent(event)
}

const isVisible = elem => !!elem && !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length ) // source (2018-03-11): https://github.com/jquery/jquery/blob/master/src/css/hiddenVisibleSelectors.js

const InputRoot = styled.div`
  width: ${WIDTH};
  *, *::after, *::before {
    box-sizing: border-box;
  }
`

const Label = styled.div`
  margin-bottom: 8px;
  font-weight: bold;
`

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`

const Input = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  border: 1px solid lightgrey;
  border-radius: 8px;
  cursor: text;
  ${props => props.focused && 'border: 1px solid blue'};
  transition: border 300ms;

  padding: 4px;
  > * { margin: 4px; }
`

const FilterIcon = styled(RawFilterIcon)`
  margin-right: 8px;
`

const RealInputWrapper = styled.span`
  display: inline-flex;
  align-items: center;
`

const RealInput = styled.input`
  height: 24px;
  border-width: 0;
  :focus {
    outline: none;
  }
`

const SuggestionsBox = styled.div`
  width: 100%;
  border: 1px solid lightgrey;
  border-radius: 8px;
  max-height: 400px;
  overflow-y: auto;
`

const BetterSolution = _props => {
  const [filter, setFilter] = useState('')
  const [focused, setFocused] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [focusedSuggestionIndex, setFocusedSuggestionIndex]  = useState(0)
  const [value, setValue] = useState({})
  const realInputRef = useRef()

  // useEffect(_ => {
  //   if (!realInputRef.current) { return }
  //
  //   const outsideClickListener = ev => {
  //     if (ev.target.closest(realInputRef.current).length > 0) {
  //
  //     }
  //   }
  //
  //   document.addEventListener('click', outsideClickListener)
  //   return _ => document.removeEventListener('click', outsideClickListener)
  // }, [realInputRef])

  const fetchSuggestions = debounce(async filter => {
    try {
      const suggestions = await doFetchSuggestions(filter)
      setSuggestions(suggestions)
    } catch(response) {
    }

    setShowSuggestions(true)
    setFocusedSuggestionIndex(0)
  }, FETCH_SUGGESTIONS_DEBOUNCE_TIMEOUT)

  const toggleOption = city => {
    const key = city.geonameid
    setValue({
      ...value,
      [key]: value[key] === undefined ? city : undefined
    })
  }

  const unSelectOption = city => {
    const key = city.geonameid
    setValue(v => ({ ...v, [key]: undefined }))
  }

  const handleKeyDown = ev => {
    if (ev.key === 'ArrowDown') {
      setFocusedSuggestionIndex(index => index >= suggestions.length - 1 ? index : index + 1 )
    } else if (ev.key === 'ArrowUp') {
      setFocusedSuggestionIndex(index => index <= 0 ? index : index - 1 )
    } else if (ev.key === 'Enter') {
      const selectedSuggestion = suggestions[focusedSuggestionIndex]
      selectedSuggestion && toggleOption(selectedSuggestion)
    } else if (ev.key === 'Escape') {
      setShowSuggestions(false)
      setFilter('')
      realInputRef.current.blur()
    }
  }

  const onRealInputChange = ev => {
    setFilter(ev.target.value)
    fetchSuggestions(ev.target.value)
  }

  return (
    <InputRoot>
      <Label>Choose your cities</Label>
      <InputWrapper onKeyDown={handleKeyDown}>
        <Input
          onClick={_ => realInputRef.current && triggerFocus(realInputRef.current)}
          focused={focused}
        >
          {Object.values(value).map(city => city && (
            <SelectedValueChip
              key={city.geonameid}
              value={city.name}
              onClick={_ => unSelectOption(city)}
            />)
          )}

          <RealInputWrapper>
            {focused && <FilterIcon />}
            <RealInput
              ref={realInputRef}
              value={filter}
              onChange={onRealInputChange}
              placeholder='Type for suggestions...'
              onFocus={_ => setFocused(true)}
              onBlur={_ => setFocused(false)}
            />
          </RealInputWrapper>
        </Input>

        {showSuggestions && (
          <SuggestionsBox>
            {suggestions.map((s, index) => (
              <Suggestion
                onChecked={_ => toggleOption(s)}
                checked={!!value[s.geonameid]}
                focused={index === focusedSuggestionIndex}
                key={s.geonameid}
                country={s.country}
                subcountry={s.subcountry}
                name={s.name}
                ref={node => {
                  if (!node) { return }
                  index === focusedSuggestionIndex && scrollIntoView(node, { scrollMode: 'if-neeed '})
                }}
              />
            ))}
          </SuggestionsBox>
        )}
      </InputWrapper>
    </InputRoot>
  )
}

export default BetterSolution
