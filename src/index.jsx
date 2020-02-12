import 'regenerator-runtime/runtime'
import 'normalize.css'

import React from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'

import SimpleSolution from './SimpleSolution'
import BetterSolution from './BetterSolution'

const Root = styled.div`
  font-family: Helvetica;
  > * {
    margin: 40px;
  }
`

const SolutionWrapper = styled.div`
  margin: 24px;
  padding: 24px;
  border: 1px solid black;
`

const App = _props => (
  <Root>
    <SolutionWrapper>
      <p>
        This is the simplest solution I figured out.
        <br />
        I didn't want to invest a lot of time into making a custom checkbox.
        <br />
        I know how to do that, but in real life we would most likely use a 3rd party component and it's not one of our biggest concerns anyway.
        <br />
        This thing has a couple UX problems that I will solve in the next proposal:
      </p>

      <ul>
        <li>There's no feedback while suggestions are being fetched</li>
        <li>There's no feedback when API returns no results</li>
        <li>Sometimes the API returns a 500 status code, leaving the user on limbo. I assume you did this on purpose to see how I handle it, but I didn't fix it here.</li>
        <li>Checkbox in the only clickable thing, not whole suggestion</li>
        <li>There's no way to close the suggestions list once is displayed. Even if you could, there would be no feedback about which cities were selected</li>
        <li>Power users would benefit from being able to use this input with just a keyboard, but we don't support that</li>
      </ul>

      <SimpleSolution />
    </SolutionWrapper>

    <SolutionWrapper>
      <BetterSolution />
    </SolutionWrapper>
  </Root>
)

ReactDOM.render(<App />, document.getElementById('root'))
