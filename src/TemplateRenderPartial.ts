import TemplateRender from './TemplateRender'
import Token from './Token'

type TemplateRenderPartial = (token: Token, next: TemplateRender) => TemplateRender

export default TemplateRenderPartial
