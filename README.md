# MDformat

MDformat is a Markdown template engine designed with end users in mind.

MDformat implements a significantly reduced number of template language constructs to ensure simplicity for users new to templating. It offers an intuitive experience for inexperienced users and integrates a hint of heuristics to expand the feature set without introducing unnecessary language complexity.

Features:

- Mapping hierarchical data onto templates
- Automatic expansion of paragraphs, lists, and tables into multiple rows when generated from data fields scoped to collection elements
- Implementation of zip groups, enabling the combination of elements from multiple collections into one unified collection
- Automatically encoding placeholder values if it's a part of a URL

The engine leverages the [marked](https://www.npmjs.com/package/marked) package for Markdown parsing and rendering.

## Installation

You can install MDformat via npm. Make sure you have Node.js installed on your machine.

```bash
npm install mdformat
```

Alternatively, if you prefer using yarn:

```bash
yarn add mdformat
```

Once installed, you can start using MDformat in your project.

## Examples

### Rendering template with a missing field

MDformat won't throw an error if input data is missing, but rather render the placeholder as is.

```typescript
import { renderTemplateToHtml } from 'mdformat'

const content = 'Lorem ipsum dolor sit amet, {{consectetur}} adipiscing elit'
const data = {}
const result = renderTemplateToHtml(content, data)
// Output: <p>Lorem ipsum dolor sit amet, {{consectetur}} adipiscing elit</p>\n
```

### Rendering template with array data

MDformat defines Markdown structures commonly used for enumerating elements such as top-level paragraphs, list items, and table rows. If template for these structures include a reference to an array data field or its nested properties, MDformat replicates these structures within their respective parent elements.

```typescript
import { renderTemplateToHtml } from 'mdformat'

const content = 'Lorem ipsum dolor {{sit}} amet'
const data = {
  sit: ['consectetur', 'adipiscing', 'elit'],
}
const result = renderTemplateToHtml(content, data)
/* Output:
<p>Lorem ipsum dolor consectetur amet</p>
<p>Lorem ipsum dolor adipiscing amet</p>
<p>Lorem ipsum dolor elit amet</p>
*/
```

```typescript
import { renderTemplateToHtml } from 'mdformat'

const content = '- Lorem ipsum dolor {{sit}} amet'
const data = {
  sit: ['consectetur', 'adipiscing', 'elit'],
}
const result = renderTemplateToHtml(content, data)
/* Output:
<ul>
<li>Lorem ipsum dolor consectetur amet</li>
<li>Lorem ipsum dolor adipiscing amet</li>
<li>Lorem ipsum dolor elit amet</li>
</ul>
*/
```

### Rendering template with permutated fields

If a Markdown structure references two or more fields that are arrays or nested properties within arrays, but do not share the same array as their common ancestor, the elements of the arrays are permuted. The max number of permutations can be configured to avoid out of memory, especially when using the library in the back-end.

```typescript
import { renderTemplateToHtml } from 'mdformat'

const content = '{{name}} goes to {{city}}!'
const data = {
  name: ['Eduardo', 'Leanna', 'Benjamin'],
  city: ['Haydenmouth', 'Luzport'],
}
const result = renderTemplateToHtml(content, data)
/* Output:
<p>Eduardo goes to Fort Haydenmouth!</p>
<p>Leanna goes to Fort Haydenmouth!</p>
<p>Benjamin goes to Fort Haydenmouth!</p>
<p>Eduardo goes to Lake Luzport!</p>
<p>Leanna goes to Lake Luzport!</p>
<p>Benjamin goes to Lake Luzport!</p>
*/
```

### Rendering template with zipped fields

To avoid permutation when a Markdown structure refers to two or more fields that are arrays or nested properties within arrays, but do not share the same array as their common ancestor, the user can define a zip group. This zip group combines the arrays into one by index of items. If arrays have different sizes, the lesser number of items is taken.

```typescript
import { renderTemplateToHtml } from 'mdformat'

const content = '{{itinerary:name}} goes to {{itinerary:city}}!'
const data = {
  name: ['Eduardo', 'Leanna', 'Benjamin'],
  city: ['Haydenmouth', 'Luzport'],
}
const result = renderTemplateToHtml(content, data)
/* Output:
<p>Eduardo goes to Fort Haydenmouth!</p>
<p>Leanna goes to Lake Luzport!</p>
<p>Benjamin goes to Felicitystad!</p>
*/
```

### Rendering template with placeholder in query parameter

The placeholders are encoded if they are a part of a URL.

```typescript
import { renderTemplateToHtml } from 'mdformat'

const content = 'Lorem [ipsum](https://dolor.com/?sit={{sit}}) amet'
const data = {
  sit: 'do&eiusmod=tempor',
}
const result = renderTemplateToHtml(content, data)
/* Output:
<p>Lorem <a href="https://dolor.com/?sit=do%26eiusmod%3Dtempor">ipsum</a> amet</p>\n
*/
```

## API

`renderTemplateToHtml(template, data, lexer?, parser?)`

Creates an HTML markup based on provided Markdown template and the data object. Can accept a string, as well as a collection of tokens as a template.

`renderTemplateToTokens(template, data, lexer?)`

Provides ability to integrate the template into a bigger processing pipeline, that operates Markdown tokens.

`createRender(template, lexer?)`

Creates a function, that applies data to provided template. The returned function can be provided as an input to `renderTemplateToHtml` and `renderTemplateToTokens`, as well as used on its own. This is recommended to be used in scenarios, when data is changed more often than the template itself. The function is enhanced with `refs` property, which provides an array of placeholders, implemented in the template.

## Security

When using MDformat to generate HTML content from Markdown templates, it's essential to be cautious about potential security risks associated with untrusted user input or Markdown content. The generated HTML may include user-generated or dynamic content, which can pose risks if not properly sanitized.

To mitigate these risks, it's strongly recommended to employ post-processing techniques to sanitize the generated HTML before rendering it in a web application. One popular solution for this purpose is the dompurify package, which provides robust sanitization capabilities for ensuring that the HTML content is safe to use in a browser environment.

Here's a basic example of how you can integrate [dompurify](https://www.npmjs.com/package/dompurify) into your application:

```typescript
import DOMPurify from 'dompurify'

// Define 'content' and 'data'
const content = ''
const data = {}

const htmlContent = renderTemplateToHtml(content, data)

// Assume 'htmlContent' contains the generated HTML content
const sanitizedHTML = DOMPurify.sanitize(htmlContent)

// Use 'sanitizedHTML' in your application
```

By incorporating dompurify or similar sanitization libraries into your workflow, you can help protect your application from various security vulnerabilities associated with untrusted HTML content.
