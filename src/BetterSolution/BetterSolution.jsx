import React, { useState, useRef, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import debounce from 'lodash.debounce'
import sortBy from 'lodash.sortBy'
import scrollIntoView from 'scroll-into-view-if-needed'

import doFetchSuggestions from '../fetchSuggestions'
import Suggestion from './Suggestion'
import SelectedValueChip from './SelectedValueChip'

import FilterIcon from './filter.svg'
import LoaderIcon from './loader.svg'

const WIDTH = '400px'
const FETCH_SUGGESTIONS_DEBOUNCE_TIMEOUT = 400

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

const IconWrapper = styled.span`
  margin-right: 8px;
`

const RealInputWrapper = styled.span`
  flex-grow: 1;
  display: inline-flex;
  align-items: center;
`

const RealInput = styled.input`
  flex-grow: 1;
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

  &:empty {
    display: none;
  }
`

const SuggestionsMessage = styled.div`
  text-align: center;
  padding: 16px;
`

const BetterSolution = _props => {
  const [filter, setFilter] = useState('')
  const [focused, setFocused] = useState(true)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [focusedSuggestionIndex, setFocusedSuggestionIndex] = useState(0)
  const [value, setValue] = useState({})
  const [errored, setErrored] = useState(false)
  const [fetching, setFetching] = useState(false)
  const rootInputRef = useRef()
  const realInputRef = useRef()

  // Detect click outside of element and close input
  useEffect(_ => {
    if (!rootInputRef.current) { return }

    const outsideClickListener = ev => {
      if (ev.target !== rootInputRef.current && !rootInputRef.current.contains(ev.target)) {
        setShowSuggestions(false)
        setFilter('')
        setSuggestions([])
      }
    }

    document.addEventListener('click', outsideClickListener)
    return _ => document.removeEventListener('click', outsideClickListener)
  }, [realInputRef])

  const fetchSuggestions = useCallback(
    debounce(async (filter, retries = 3) => {
      setFetching(true)
      setErrored(false)

      try {
        const suggestions = await doFetchSuggestions(filter)

        setSuggestions(suggestions)
        setFetching(false)
        setShowSuggestions(true)
        setFocusedSuggestionIndex(0)
      } catch(response) {
        if (retries > 0) {
          fetchSuggestions(filter, retries - 1)
        } else {
          setShowSuggestions(true)
          setErrored(true)
          setFetching(false)
          // This is where I would send the error to an error collection service
        }
      }
    }, FETCH_SUGGESTIONS_DEBOUNCE_TIMEOUT),
    []
  )

  // Sort and remove entries where value is undefined
  const sortValueEntries = v => sortBy(Object.values(v), 'position').filter(v => v)

  const toggleOption = city => {
    const key = city.geonameid
    setValue({
      ...value,
      [key]: value[key] === undefined ? { ...city, position: Object.entries(value).length } : undefined
    })
  }

  const unSelectOption = city => {
    const key = city.geonameid
    setValue(v => ({ ...v, [key]: undefined }))
  }

  const unSelectLastOption = _ => setValue(v => {
    const sorted = sortValueEntries(v)
    if (!sorted.length) { return v }
    const lastEntry = sorted[sorted.length - 1]
    return { ...value, [lastEntry.geonameid]: undefined }
  })

  const handleKeyDown = ev => {
    if (ev.key === 'ArrowDown') {
      setFocusedSuggestionIndex(index => index >= suggestions.length - 1 ? index : index + 1 )
    } else if (ev.key === 'ArrowUp') {
      setFocusedSuggestionIndex(index => index <= 0 ? index : index - 1 )
    } else if (ev.key === 'Enter') {
      const selectedSuggestion = suggestions[focusedSuggestionIndex]
      selectedSuggestion && toggleOption(selectedSuggestion)
    } else if (ev.key === 'Backspace' && filter === '') {
      unSelectLastOption()
    } else if (ev.key === 'Escape') {
      setShowSuggestions(false)
      setFilter('')
      realInputRef.current.blur()
    }
  }

  const onRealInputChange = ev => {
    const value = ev.target.value
    setFilter(value)
    value.trim() && fetchSuggestions(value)
  }

  const onRealInputBlur = ev => {
    setFocused(false)
    setFilter('')
  }

  const onSuggestionChecked = city => {
    toggleOption(city)
    setFocused(true)
  }

  return (
    <InputRoot ref={rootInputRef}>
      <Label>Choose your cities</Label>
      <InputWrapper onKeyDown={handleKeyDown}>
        <Input
          onClick={_ => realInputRef.current && triggerFocus(realInputRef.current)}
          focused={focused}
        >
          {sortValueEntries(value).map(city => city && (
            <SelectedValueChip
              key={city.geonameid}
              value={city.name}
              onClick={_ => unSelectOption(city)}
            />)
          )}

          <RealInputWrapper>
            {focused && (
              <IconWrapper>
                {fetching ? <LoaderIcon /> : <FilterIcon />}
              </IconWrapper>
            )}
            <RealInput
              ref={realInputRef}
              value={filter}
              onChange={onRealInputChange}
              placeholder='Type for suggestions...'
              onFocus={_ => setFocused(true)}
              onBlur={onRealInputBlur}
            />
          </RealInputWrapper>
        </Input>

        {showSuggestions && (
          <SuggestionsBox>
            {errored && (
              <SuggestionsMessage>
                There was an while error fetching suggestions.
                Please try again later.
              </SuggestionsMessage>
            )}
            {!errored && !!suggestions.length && suggestions.map((s, index) => (
              <Suggestion
                onChecked={_ => onSuggestionChecked(s)}
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
            {!errored && !suggestions.length && !fetching && (
              <SuggestionsMessage>
                There are no results for your search
              </SuggestionsMessage>
            )}
          </SuggestionsBox>
        )}
      </InputWrapper>
    </InputRoot>
  )
}

export default BetterSolution
