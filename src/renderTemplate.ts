import type { TemplateDataByRefs } from './TemplateDataByRefs'
import type { TemplateGroupRender } from './TemplateRender'
import { isRender } from './TemplateRender'
import type { Token } from './Token'

export function renderTemplate(
  template: Token | TemplateGroupRender,
  data: TemplateDataByRefs,
): Array<Token> {
  return isRender(template) ? template.render(data) : [template]
}
