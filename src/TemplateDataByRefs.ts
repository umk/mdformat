import type { Content } from './Content'
import type { TemplateData } from './TemplateData'
import type { Ref } from './TemplatePart'

export type TemplateDataByRefs = {
  /**
   * The template data for grouped refs.
   */
  key: TemplateData
  /**
   * A collection of template data outside of the grouping.
   */
  data: Array<TemplateData>
}

export function groupDataByRefs(
  data: Array<TemplateData>,
  refs: Array<Ref>,
): Array<TemplateDataByRefs> {
  // Group refs by their group ID
  const refGroups: Record<string, Array<Ref>> = {}
  for (const ref of refs) {
    ;(refGroups[ref.group] || (refGroups[ref.group] = [])).push(ref)
  }
  return Object.entries(refGroups).reduce<Array<TemplateDataByRefs>>(
    (prev, [groupId, refs]) =>
      prev.flatMap(({ key, data }) => {
        // The template data records are allocated into buckets
        // by an index of referenced item in current group, then...
        const groups = data
          .reduce<Array<Array<TemplateData>>>((prev, cur) => {
            const group = cur.groups[groupId]
            if (group) {
              const { index } = group
              ;(prev[index] || (prev[index] = [])).push(cur)
            }
            return prev
          }, [])
          .map(
            (data, index): TemplateDataByRefs => ({
              key: {
                groups: {
                  ...key.groups,
                  [groupId]: { index, refs: {} },
                },
              },
              data,
            }),
          )
        // ...allocate buckets themselves into smaller buckets by
        // an array value, that contains substitution.
        return refs.reduce(
          (prev, ref) =>
            prev.flatMap(({ key, data }) => {
              const dataByRef = data.reduce((prev, cur) => {
                const value = cur.groups[groupId].refs[ref.path]
                let arr = prev.get(value)
                if (!arr) {
                  prev.set(value, (arr = []))
                }
                arr.push(cur)
                return prev
              }, new Map<Array<Content>, Array<TemplateData>>())
              return Array.from(dataByRef.entries()).map(([value, data]): TemplateDataByRefs => {
                const currentGr = key.groups[groupId]
                return {
                  key: {
                    groups: {
                      ...key.groups,
                      [groupId]: {
                        ...currentGr,
                        refs: {
                          ...currentGr.refs,
                          [ref.path]: value,
                        },
                      },
                    },
                  },
                  data,
                }
              })
            }),
          groups,
        )
      }),
    [{ key: { groups: {} }, data }],
  )
}
