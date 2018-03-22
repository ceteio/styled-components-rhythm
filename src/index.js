export default function({
  baseFontSize,
  defaultLineHeight,
  // Works best when it divides evenly into (baseFontSize * lineHeight)
  rhythmHeight,
  // Object of <font name>: scale (0-1)
  // Calculate with a tool like https://codepen.io/sebdesign/pen/EKmbGL?editors=0011
  capHeights,
  debug = false,
}) {

  function rhythmShift(font, lineHeight, fontSize = baseFontSize) {
    const capHeight = capHeights[font];
    return Math.round(((lineHeight - capHeight) * fontSize) / 2);
  }

  function roundToMultiple(value, multiple, direction = 'nearest') {
    const rounded = Math.round(value / multiple) * multiple;

    if (direction === 'up' && rounded < value) {
      return rounded + multiple;
    } else if (direction === 'down' && rounded > value) {
      return rounded - multiple;
    }

    return rounded;
  }

  function rhythmLineHeight(font, fontSizeRem, desiredLineHeight = defaultLineHeight) {
    const capHeight = capHeights[font];

    // The calculated line height
    const desiredHeight = baseFontSize * fontSizeRem * desiredLineHeight;

    // Rounded to the nearest rhythm line
    let roundedHeight = roundToMultiple(desiredHeight, rhythmHeight);

    // Disallow line heights below the cap height
    if (roundedHeight < capHeight) {
      roundedHeight = roundToMultiple(capHeight, rhythmHeight, 'up');
    }

    // convert back to a value relative to the font size rem
    return roundedHeight / baseFontSize / fontSizeRem;
  }

  return {
    theme: {
      rhythmHeight,
      setFontWithRhythm(fontName, fontSizeRem, desiredLineHeight) {
        const lineHeight = rhythmLineHeight(fontName, fontSizeRem, desiredLineHeight);
        const shift = rhythmShift(fontName, lineHeight, fontSizeRem * baseFontSize);

        return `
          font-family: ${fontName};
          font-size: ${fontSizeRem}rem;
          padding-top: ${shift}px;
          margin-bottom: -${shift}px;
          /* Unitless so it's relative to the calculated font size of the element */
          /* https://css-tricks.com/almanac/properties/l/line-height/#comment-1587658 */
          line-height: ${lineHeight};
        `;
      },

      rhythmSizing(multiple) {
        return rhythmHeight * multiple;
      },
    },
    global: `
      ${debug ? `
        html {
          background: linear-gradient(rgba(255, 0, 0, 0.15), rgba(255, 0, 0, 0.15) 1px, transparent 1px);
          background-size: 1px ${rhythmHeight}px;
        }
      ` : ''}

      /* Specify our global font size */
      body {
        font-size: ${baseFontSize / 16 * 100}%;
      }
    `,
  };
}
