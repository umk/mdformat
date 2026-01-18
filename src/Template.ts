import type { Placeholder, Ref, TemplateParts } from './TemplatePart'

const ID_REGEX = '[_\\p{L}][_\\p{L}\\p{Nd}]*'

/**
 * A regular expression that matches a sequence of JavaScript
 * property names separated by dots. This supports only a subset of
 * the JavaScript property names.
 */
const PATH_REGEX = `${ID_REGEX}(\\.${ID_REGEX})*`

/**
 * A regular expression that matches template data field reference. The
 * path denotes the path through object hierarchy to the data field, that
 * substitutes the reference. The group is optional and denotes a key,
 * that is used to zip the data field values with the same group value.
 */
const REF_REGEX = new RegExp(`\\{\\{((?<group>${ID_REGEX}):)?(?<path>${PATH_REGEX})\\}\\}`, 'gu')

export type Template = {
  /**
   * The template parts.
   */
  parts: TemplateParts
  /**
   * A collection of fields referenced from the template
   * @internal
   */
  refs?: Array<Ref>
} & { __brand: 'template' }

export function getTemplateRefs(template: Template): Array<Ref> {
  let refs = template.refs
  if (!refs) {
    template.refs = refs = template.parts.filter((p) => typeof p === 'object') as Array<Ref>
  }
  return refs
}

export function createTemplate(template: string): Template {
  const matches = Array.from(template.matchAll(REF_REGEX)).map((match) => ({
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    index: match.index!,
    raw: match[0],
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    path: match.groups!.path,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    group: match.groups!.group ?? match.groups!.path,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    modifier: match.groups!.modifier as string | undefined,
  }))
  const parts: TemplateParts = []
  // const refs: Map<string, Ref> = new Map()
  const refs: Record<string, Record<string, Ref>> = {}
  let lastIndex = 0
  for (const { index, raw, path, group } of matches) {
    parts.push(template.slice(lastIndex, index))
    lastIndex = index + raw.length
    const properties = path.split('.')
    const ref: Placeholder = { path, properties, group, raw }
    ;(refs[group] || (refs[group] = {}))[path] = ref
    parts.push(ref)
  }
  parts.push(template.slice(lastIndex))
  return {
    parts,
    refs: Object.values(refs).flatMap((g) => Object.values(g)),
  } as Template
}
