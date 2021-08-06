import { renderHook } from '@testing-library/react-hooks'
import { useState } from 'react'
import { act } from 'react-dom/test-utils'

test('should use counter', () => {
  const { result } = renderHook(() => useState(20))

  expect(result.current[0]).toBe(20)
  expect(typeof result.current[1]).toBe('function')

  act(()=>result.current[1](x=>x*2));
  expect(result.current[0]).toBe(40)

})