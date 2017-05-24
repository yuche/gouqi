import reducers from '../ui'
import { initState as state } from '../ui'

test('ui/toast', () => {
  expect(
    reducers(state, {
      type: 'ui/toast',
      payload: {
        kind: 'kind',
        text: 'text'
      }
    })
  ).toEqual({
    ...state,
    toast: {
      kind: 'kind',
      text: 'text',
      id: 1
    }
  })
})

test('ui/modal/playlist/show', () => {
  expect(
    reducers(state, {
      type: 'ui/modal/playlist/show',
      payload: 'collect'
    })
  ).toEqual({
    ...state,
    modal: {
      ...state.modal,
      playlist: {
        visible: true,
        id: 1,
        kind: 'collect'
      }
    }
  })
})

test('ui/modal/playlist/hide', () => {
  expect(
    reducers(state, {
      type: 'ui/modal/playlist/hide',
      payload: 'collect'
    })
  ).toEqual({
    ...state,
    modal: {
      ...state.modal,
      playlist: {
        visible: false,
        id: 2
      }
    }
  })
})

test('ui/popup/playlist/show', () => {
  expect(
    reducers(state, {
      type: 'ui/popup/playlist/show'
    })
  ).toEqual({
    ...state,
    popup: {
      ...state.popup,
      playlist: {
        visible: true,
        id: 1
      }
    }
  })
})
test('ui/popup/playlist/hide', () => {
  expect(
    reducers(state, {
      type: 'ui/popup/playlist/hide'
    })
  ).toEqual({
    ...state,
    popup: {
      ...state.popup,
      playlist: {
        visible: false,
        id: 2
      }
    }
  })
})
test('ui/popup/track/show', () => {
  expect(
    reducers(state, {
      type: 'ui/popup/track/show'
    })
  ).toEqual({
    ...state,
    popup: {
      ...state.popup,
      track: {
        visible: true,
        id: 1
      }
    }
  })
})
test('ui/popup/track/hide', () => {
  expect(
    reducers(state, {
      type: 'ui/popup/track/hide'
    })
  ).toEqual({
    ...state,
    popup: {
      ...state.popup,
      track: {
        visible: false,
        id: 2
      }
    }
  })
})

test('ui/popup/collect/show', () => {
  expect(
    reducers(state, {
      type: 'ui/popup/collect/show'
    })
  ).toEqual({
    ...state,
    popup: {
      ...state.popup,
      collect: {
        visible: true,
        id: 1
      }
    }
  })
})
test('ui/popup/collect/hide', () => {
  expect(
    reducers(state, {
      type: 'ui/popup/collect/hide'
    })
  ).toEqual({
    ...state,
    popup: {
      ...state.popup,
      collect: {
        visible: false,
        id: 2
      }
    }
  })
})
