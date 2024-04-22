import TemplateDataByRefs from './TemplateDataByRefs'
import TemplateRender, { isRender } from './TemplateRender'
import Token from './Token'

function renderTemplate(template: TemplateRender, data: TemplateDataByRefs): Array<Token> {
  return isRender(template) ? template.render(data) : [template]
}

export default renderTemplate
