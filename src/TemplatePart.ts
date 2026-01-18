import type { Content } from './Content'

export type Ref = {
  /**
   * An identifier of the reference, which consists of the path
   * to the data field and an optional group name. The path is
   * provided in exact wording that provided in the template.
   */
  path: string
  properties: Array<string>
  group: string
}

/**
 * An ordered collection of template parts. Each part is either a string
 * or a reference to a data field. When formatting, the parts are simply
 * concatenated with the data field values substituted for the references.
 */
export type TemplateParts = Array<TemplatePart>

export type TemplatePart = string | Placeholder

export type PlaceholderFormatter = (content: Content) => Content

export type Placeholder = Ref & {
  /**
   * A function that formats the template value before
   * adding it to a rendered string.
   */
  formatter?: PlaceholderFormatter
  /**
   * The raw string representing the placeholder.
   */
  raw: string
}

/**
 * Gets a value indicating whether provided part is a placeholder
 * rather than a raw value.
 * @param part The part
 * @returns A value indicating whether part is a placeholder
 */
export function isPlaceholder(part: TemplatePart): part is Placeholder {
  return typeof part === 'object'
}
