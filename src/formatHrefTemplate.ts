import type { Content } from './Content'
import type { Template } from './Template'
import { isPlaceholder } from './TemplatePart'

function formatQueryValue(content: Content): Content {
  return encodeURIComponent(String(content))
}

export function formatHrefTemplate(template: Template): Template {
  let previousRaw: string | undefined = undefined
  for (let i = 0; i < template.parts.length; i++) {
    const part = template.parts[i]
    if (isPlaceholder(part)) {
      if (previousRaw?.length && ['/', '='].includes(previousRaw[previousRaw.length - 1])) {
        part.formatter = formatQueryValue
      }
      previousRaw = undefined
    } else if (part.length > 0) {
      previousRaw = part
    }
  }
  return template
}
