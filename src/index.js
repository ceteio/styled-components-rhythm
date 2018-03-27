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
    return ((lineHeight - capHeight) * fontSize) / 2;
  }

  function roundToMultiple(value, multiple, direction = 'nearest') {
    const remainder = value % multiple;

    if (direction === 'up') {
      // force rounding up
      return value - remainder + multiple;
    } else if (direction === 'down') {
      // force rounding down
      return value - remainder;
    } else if (remainder >= multiple / 2) {
      // round up on exactly half or above
      return value - remainder + multiple;
    } else {
      // round down on less than half
      return value - remainder;
    }
  }

  function rhythmLineHeight(font, fontSizeRem, desiredLineHeight = defaultLineHeight) {
    const capHeight = capHeights[font];

    // The calculated line height
    const desiredHeight = baseFontSize * fontSizeRem * desiredLineHeight;
    const capHeightRem = baseFontSize * fontSizeRem * capHeight;

    // Rounded to the nearest rhythm line
    let roundedHeight = roundToMultiple(desiredHeight, rhythmHeight);

    // Disallow line heights below the cap height
    if (roundedHeight < capHeightRem) {
      roundedHeight = roundToMultiple(capHeightRem, rhythmHeight, 'up');
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
          padding-top: ${shift}rem;
          margin-bottom: -${shift}rem;
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
          background-size: 1px ${rhythmHeight}rem;
        }
      ` : ''}

      /* Specify our global font size */
      body {
        font-size: ${baseFontSize * 100}%;
      }
    `,
  };
}
