/* global fetch */
const CITIES_URL = 'http://localhost:3030/cities'
const SUGGESTIONS_LIMIT = 20

const fetchSuggestions = async (filter = '') => {
  const url = new URL(CITIES_URL)

  url.searchParams.append('limit', SUGGESTIONS_LIMIT)
  url.searchParams.append('filter', filter)

  const response = await fetch(url)
  if (response.status !== 200) { throw response } // eslint-disable-line no-throw-literal
  const { data } = await response.json()
  return data
}

export default fetchSuggestions
