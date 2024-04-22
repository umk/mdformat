import Template from './Template'
import TemplateData from './TemplateData'
import { isPlaceholder } from './TemplatePart'

/**
 * Creates a content that represents the template bound to the data
 * object, where each of the data object properties can be referenced
 * from the template.
 * @param template The template structure.
 * @param data A template data record
 * @returns A string that represents the template bound to the data object.
 */
function formatTemplate(template: Template, data: TemplateData): string {
  return template.parts
    .map((part) => {
      if (!isPlaceholder(part)) {
        return part
      }
      const { path, group } = part
      const d = data.groups[group]
      if (d) {
        const { index, refs } = data.groups[group]
        const ref = refs[path]
        if (ref) {
          let content = ref[index]
          if (part.formatter) {
            content = part.formatter(content)
          }
          return content
        }
      }
      return part.raw
    })
    .join('')
}

export default formatTemplate
