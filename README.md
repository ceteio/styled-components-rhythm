# Styled Components Rhythm

A utility for correctly setting vertical rhythm and aligning text to a baseline
beyond what CSS can provide.

## Usage

```javascript
import { ThemeProvider, injectGLobal }, styled from 'styled-components';
import styledComponentsRhythm from 'styled-components-rhythm';

const rhythm = styledComponentsRhythm({
  baseFontSize: 16,
  baseLineHeight: 1.2,
  rhythmHeight: 12,
  capHeights: {
    Lato: 0.72,
  },
  debug: true,
});

injectGLobal`
  /* Reset global margins and padding */
  h1, p {
    margin: 0;
    padding: 0;
  }

  /* Using Lato font https://fonts.google.com/specimen/Lato */
  @import url('https://fonts.googleapis.com/css?family=Lato')

  ${rhythm.global}
`;

const H1 = styled.h1`
  ${props => props.theme.setFontWithRhythm('Lato', 3)}
  margin-top: ${props => props.theme.rhythmSizing(3)}px;
`;

const Paragraph = styled.p`
  ${props => props.theme.setFontWithRhythm('Lato', 1)}
  margin-top: ${props => props.theme.rhythmSizing(2)}px;
`;

export default () => (
  <ThemeProvider theme={rhythm.theme}>
    <H1>Hello world</H1>
    <Paragraph>How are you today?</Paragraph>
    <Paragraph>I'm feeling quite <em>aligned</em>!</Paragraph>
  </ThemeProvider>
);
```

## API

Main export is a single function:

### `styledComponentsRhythm(<Object: options>) => <Object: rhythm>`

#### `options`

##### `options.baseFontSize` (`Number`)

The `px` font size of your root element (ie; the `<body>`).

##### `options.rhythmHeight` (`Number`)

The vertical grid size, to which text will have its baseline aligned.

Works best when it divides evenly into (`baseFontSize` * `lineHeight`).

##### `options.capHeights` (`Object<fontName: Number>`)

The height of capital letters for each font in use.

For example:

```javascript
{
  Lato: 0.72,
}
```

The key should match the full font name you would pass to a `font-family`
declaration.

Calculate with a tool like https://codepen.io/sebdesign/pen/EKmbGL?editors=0011

##### `options.defaultLineHeight` (`String`)

When generating CSS properties, if `line-height` is not set, it will use this
value.

Must be a unitless value, which will be relative to the font size of an element.
For more details on unitless line heights, see
[this comment](https://css-tricks.com/almanac/properties/l/line-height/#comment-1587658).

##### `options.debug` (`Boolean`)

Will inject horizontal lines to body for visually debugging alignments.

#### `rhythm`

##### `rhythm.theme` (`Object`)

Pass this object to a styled-components `ThemeProvider` as the theme:

```javascript
return (
  <ThemeProvider theme={rhythm.theme}>
    ...
  </ThemeProvider>
);
```

It provides:

###### `rhythmHeight`

The value as passed when creating the theme object.

###### `setFontWithRhythm(fontName, fontSizeRem, desiredLineHeight) => String`

The main function which will generate the CSS necessary to correctly align the
font to a rhythm baseline.

This function makes 2 assumptions:

1. All previous elements on the page are also correctly aligned to your vertical
   rhythm.
2. You will not manually set `padding-top` or `margin-bottom` on this element.

**Parameters**

- **`fontName`** Should match the font name as you would declare it in the CSS
  property `font-family`.
- **`fontSizeRem`** A multiple of `baseFontSize`.
- **`desiredLineHeight`** Will be rounded to the nearest rhythm line so you
  don't have to worry.

The output is the CSS string to add to the component:

```javascript
const H1 = styled.h1`
  ${props => props.theme.setFontWithRhythm('Lato', 3)}
`;
```

###### `rhythmSizing(multiple) => Number`

A simple helper to calculate `multiple * rhythmHeight`.

Works great for setting margins or padding:

const H1 = styled.h1`
  margin-top: ${props => props.theme.rhythmSizing(3)}px;
`;

##### `rhythm.global` (`String`)

A string containing global CSS that needs to be applied. Best done using
styled-component's `injectGlobal`:

```javascript
injectGlobal`
  ${rhythm.global}
`;
```
