import { configuration } from './Configuration'
import type { Content, ContentPrimitive } from './Content'
import type { Template } from './Template'
import { getTemplateRefs } from './Template'
import type { Ref } from './TemplatePart'

/**
 * A mapping from a group name to an object that contains
 * another mapping from a data reference field to substitution
 * for that field.
 */
export type TemplateData = {
  groups: Record<string, TemplateDataGroup>
}

export type TemplateDataGroup = {
  /**
   * Index of the record in the group taken as a substitution
   * for placeholder.
   */
  index: number
  refs: TemplateDataRefs
}

/**
 * A mapping from a data reference field to an object that
 * contains substitution for that field. The key is provided
 * in exact wording that provided in the template.
 */
export type TemplateDataRefs = Record<string, Array<Content>>

export function getTemplateData(
  templateOrRefs: Template | Array<Ref>,
  content: Content,
): Array<TemplateData> {
  const refs = Array.isArray(templateOrRefs) ? templateOrRefs : getTemplateRefs(templateOrRefs)
  const refsByProperty = refs.reduce(
    (refByProperty, { path, properties: [property, ...rest], group }) => {
      let refGroup = refByProperty.get(property)
      if (!refGroup) {
        refByProperty.set(property, (refGroup = []))
      }
      refGroup.push({
        path,
        properties: rest,
        group,
      })
      return refByProperty
    },
    new Map<string | undefined, Array<Ref>>(),
  )
  const refsArr = Array.from(refsByProperty.entries())
  const items = resolveContent(content)
  return items.flatMap((item, index, values) =>
    Array.from(refsArr)
      .map(([property, samePropRefs]): Array<TemplateData> => {
        // If there is a property to traverse in order to reach
        // the placeholder value...
        if (property) {
          // ...if property value is an object...
          if (typeof item === 'object' && item !== null && property in item) {
            // ...get the substitution value from that property
            const data: Content = item[property]
            return getTemplateData(samePropRefs, data)
          } else {
            // ...otherwise substitution could not be found
            return [{ groups: {} }]
          }
        } else {
          // ...otherwise use current value as a placeholder substitution
          const onePropResult = samePropRefs.reduce<TemplateData>(
            (previous, { group, path }) => {
              let dataGroup = previous.groups[group]
              if (!dataGroup) {
                previous.groups[group] = dataGroup = { index, refs: {} }
              }
              dataGroup.refs[path] = values
              return previous
            },
            {
              groups: {},
            },
          )
          return [onePropResult]
        }
      })
      .sort((a, b) => {
        // Sort the results by the number of items for greater
        // possibility to shrink the number of results based on
        // groupings or missing properties.
        return a.length - b.length
      })
      .reduce(permutateData, [{ groups: {} }]),
  )
}

function permutateData(a: Array<TemplateData>, b: Array<TemplateData>): Array<TemplateData> {
  const result: Array<TemplateData> = []
  for (const itemA of a) {
    itemsB: for (const itemB of b) {
      const item: TemplateData = { groups: {} }
      const entries = [...Object.entries(itemA.groups), ...Object.entries(itemB.groups)]
      for (const [group, { index, refs }] of entries) {
        const groupData = item.groups[group]
        if (!groupData) {
          item.groups[group] = { index, refs: { ...refs } }
        } else {
          if (groupData.index !== index) {
            // Being in the same group, two properties have
            // different indexes and cannot be zipped.
            continue itemsB
          }
          item.groups[group] = { index, refs: { ...groupData.refs, ...refs } }
        }
      }
      result.push(item)
      if (result.length > configuration.maxPermutations) {
        throw new Error('The template resolves into too many combinations')
      }
    }
  }
  return result
}

function resolveContent(content: Content): Array<ContentPrimitive | Record<string, Content>> {
  if (Array.isArray(content)) {
    return content.flatMap((c) => resolveContent(c))
  }
  return [content]
}
