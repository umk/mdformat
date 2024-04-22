import TemplateRender from './TemplateRender'
import Token from './Token'
import createRenderItems from './createRenderItems'
import createRenderRows from './createRenderRows'
import createRenderString from './createRenderString'
import createRenderTokens from './createRenderTokens'
import formatHrefTemplate from './formatHrefTemplate'

const createTemplate = (() => {
  const evaluations = [
    createRenderString('text'),
    createRenderString('title'),
    createRenderString('href', formatHrefTemplate),
    createRenderTokens(),
    createRenderItems(),
    createRenderRows(),
  ]
  return (token: Token) =>
    evaluations.reduce<TemplateRender>((prev, cur) => cur(token, prev), token)
})()

export default createTemplate
