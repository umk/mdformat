type Configuration = {
  maxPermutations: number
}

let _configuration = {
  maxPermutations: 100,
}

/**
 * Updates global configuration of the MDformat template library.
 * @param configuration The partial configuration object.
 */
export function configure(configuration: Partial<Configuration>) {
  _configuration = { ..._configuration, ...configuration }
}

export { _configuration as configuration }

export default Configuration
