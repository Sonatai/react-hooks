// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

const useLocalStorageState = (
  key,
  defaultValue = '',
  {serialize = JSON.stringify, deserialize = JSON.parse} = {},
) => {
  const [state, setState] = React.useState(() => {
    const valueInLocalStorage = window.localStorage.getItem(key)

    if (valueInLocalStorage) {
      try {
        return deserialize(valueInLocalStorage)
      } catch (error) {
        window.localStorage.removeItem(key)
      }
    }

    return typeof defaultValue === 'function' ? defaultValue() : defaultValue
  })

  const prevKeyRef = React.useRef(key)

  React.useEffect(() => {
    const prevKey = prevKeyRef.current

    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey)
    }

    prevKeyRef.current = key
    window.localStorage.setItem(key, serialize(state))
  }, [state, key, serialize])

  return [state, setState]
}

function Greeting({initialName = ''}) {
  const [state, setState] = useLocalStorageState('user', {
    name: initialName,
    age: '',
  })

  const handleNameChange = event =>
    setState(prev => ({...prev, name: event.target.value}))

  const handleAgeChange = event =>
    setState(prev => ({...prev, age: event.target.value}))

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={state.name} onChange={handleNameChange} id="name" />
        <br />
        <label htmlFor="age">Age: </label>
        <input value={state.age} onChange={handleAgeChange} id="age" />
      </form>
      {state?.age && state?.name ? (
        <>
          Hi <strong>{state.name}</strong>
          <br />
          you are <strong>{state.age}</strong> years old :)
        </>
      ) : (
        'Please type your user data'
      )}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
