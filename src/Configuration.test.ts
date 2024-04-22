import { configuration, configure } from './Configuration'

describe('configuration', () => {
  it('returns updates configuration', () => {
    configure({ maxPermutations: 200 })
    expect(configuration.maxPermutations).toBe(200)
    configure({ maxPermutations: 400 })
    expect(configuration.maxPermutations).toBe(400)
  })
})
