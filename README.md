<p align="center">
  <img src="./img/rhythm-12px.png" height="386">
  <p align="center"><i>12px vertical rhythm with correctly aligned baselines</i><p>
  <h1 align="center">Styled Components Rhythm</h1>
  <p align="center">Beautifully aligned type with Styled Components<p>
</p>

## Installation

```
npm i @ceteio/styled-components-rhythm
```
or, with yarn:

```
yarn add @ceteio/styled-components-rhythm
```

## Usage

```javascript
import { ThemeProvider, injectGLobal }, styled from 'styled-components';
import styledComponentsRhythm from '@ceteio/styled-components-rhythm';

const rhythm = styledComponentsRhythm({
  baseFontSize: 1, // 1rem. Browser default makes this 16px
  baseLineHeight: 1.2, // unitless line-height, see: https://css-tricks.com/almanac/properties/l/line-height/#comment-1587658
  rhythmHeight: 0.75, // rem units. With browser default, this is 16px * 0.75rem == 12px
  capHeights: {
    // Calculated with https://codepen.io/sebdesign/pen/EKmbGL?editors=0011
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

  ${rhythm.global()}
`;

const H1 = styled.h1`
  ${props => props.theme.setFontWithRhythm('Lato', 3)}
  margin-top: ${props => props.theme.rhythmSizing(3)}rem;
`;

const Paragraph = styled.p`
  ${props => props.theme.setFontWithRhythm('Lato', 1)}
  margin-top: ${props => props.theme.rhythmSizing(2)}rem;
`;

export default () => (
  <ThemeProvider theme={rhythm.theme}>
    <H1>Hello world</H1>
    <Paragraph>How are you today?</Paragraph>
    <Paragraph>Feeling quite <em>aligned</em>!</Paragraph>
  </ThemeProvider>
);
```

## API

### Creating Rhythm

The main export is a function which returns a rhythm object suitable for
adding to a Styled Components `<ThemeProvider>`:

```javascript
import styledComponentsRhythm from '@ceteio/styled-components-rhythm';

const rhythm = styledComponentsRhythm(options);
// { theme: ..., global: ... }
```

#### `options` (`Object`)

- `baseFontSize` (`Number`): The `rem` font size of your root element (ie; the `<body>`).
- `rhythmHeight` (`Number`): The `rem` vertical grid size, to which text will have its baseline aligned. Works best when it divides evenly into (`baseFontSize` * `defaultLineHeight`).
- `capHeights` (`Object`): Map of `font-family` font name -> proportional height of capital letters. Heights can be calculated with [this tool](https://codepen.io/sebdesign/pen/EKmbGL?editors=0011).
  For example:
  ```javascript
  {
    Lato: 0.72,
  }
  ```
- `defaultLineHeight` (`Number`): Default for `setFontWithRhythm()` below. Must be a unitless value, which will be [relative to the font size of an element](https://css-tricks.com/almanac/properties/l/line-height/#comment-1587658).
- `debug` (`Boolean`): Will inject red horizontal lines to body for visually debugging alignments.

### Setting the theme

There are two pieces to the puzzle, both of which must be used to have effective
vertical rhythm; `rhythm.theme`, and `rhythm.global`:

```javascript
import styledComponentsRhythm from '@ceteio/styled-components-rhythm';
import { injectGlobal, ThemeProvider } from 'styled-components';

const rhythm = styledComponentsRhythm(options);

injectGlobal`${rhythm.global()}`;
return <ThemeProvider theme={rhythm.theme}>...</ThemeProvider>;
```

#### `theme` (`Object`)

Pass this object to a Styled Components `ThemeProvider` as the [theme](https://www.styled-components.com/docs/advanced#theming):

```javascript
const rhythm = styledComponentsRhythm(options);

return <ThemeProvider theme={rhythm.theme}>...</ThemeProvider>;
```

#### `global([outputType]) => String`

A string containing global CSS that needs to be applied. Best done using
styled-component's `injectGlobal`:

```javascript
const rhythm = styledComponentsRhythm(options);

injectGlobal`${rhythm.global()}`;
```

or Emotion's `<Global>` component:

```javascript
<Global styles={rhythm.global('object')} />
```

**Parameters**

- `outputType` (`String`): `'string'`: Return a css string. `'object'`: Return a
  css style object. Default: `'string'`.

### Using the theme values

You now have access to the following via the `theme` prop within a styled
component:

#### `rhythmHeight`

The value as passed when creating the theme object.

#### `setFontWithRhythm(fontName, fontSizeRem[, desiredLineHeight[, outputType]]) => String`

The main function which will generate the CSS necessary to correctly align the
font to a rhythm baseline.

This function makes 2 assumptions:

1. All previous elements on the page are also correctly aligned to your vertical
   rhythm.
2. You will not manually set `padding-top` or `margin-bottom` on this element.

**Parameters**

- `fontName` (`String`): Should match the font name as you would declare it in the CSS
  property `font-family`.
- `fontSizeRem` (`Number`): A multiple of `baseFontSize`.
- `desiredLineHeight` (`Number`): Will be rounded to the nearest rhythm line so you
  don't have to worry.
- `outputType` (`String`): `'string'`: Return a css string. `'object'`: Return a
  css style object. Default: `'string'`.

The output is the CSS string to add to the component:

```javascript
const H1 = styled.h1`
  ${props => props.theme.setFontWithRhythm('Lato', 3)}
`;
```

Or as an object using the css prop (in both Styled Components & Emotion):

```javascript
const H1 = props => (
  <h1 css={theme => theme.setFontWithRhythm('Lato', 3, 1, 'object')} />
);
```

#### `rhythmSizing(multiple) => Number`

A simple helper to calculate `multiple * rhythmHeight`.

Works great for setting margins or padding:

```javascript
const H1 = styled.h1`
  margin-top: ${props => props.theme.rhythmSizing(3)}rem;
`;
```

## Related Projects

- [`capsize`](https://seek-oss.github.io/capsize/) by Seek: _"Using font metadata, text can now be sized according to the height of its capital letters while trimming the space above capital letters and below the baseline."_
- [`basekick`](https://github.com/michaeltaranto/basekick) by [Michael Taranto](https://mobile.twitter.com/michaeltaranto) is another implementation of the same thing, targeted at LESS.
- https://www.w3.org/TR/css-rhythm-1/ is a proposal to support vertical rhythm directly in CSS.
