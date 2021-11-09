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

  function rhythmShift(font, lineHeightRem, fontSizeRem = baseFontSize) {
    const capHeightFraction = capHeights[font];
    const capHeight = fontSizeRem * capHeightFraction;

    return (lineHeightRem - capHeight) / 2;
  }

  function roundToMultiple(value, multiple, direction = 'nearest') {
    const valueRoundedDown = Math.floor(value / multiple) * multiple;

    // purposely avoiding floating point and division
    const isHalfOrOver = (value - valueRoundedDown) * 2 >= multiple;

    if (direction === 'up' || (direction == 'nearest' && isHalfOrOver)) {
      // force rounding up
      return valueRoundedDown + multiple;
    } else {
      // force rounding down
      return valueRoundedDown;
    }
  }

  function rhythmLineHeight(font, fontSizeRem, desiredLineHeight = defaultLineHeight) {
    const capHeight = capHeights[font];

    const baseFontSizePx = baseFontSize * 16;
    const fontSizePx = fontSizeRem * baseFontSizePx;
    const desiredHeightPx = desiredLineHeight * fontSizePx;
    const capHeightPx = capHeight * fontSizePx;
    const rhythmHeightPx = rhythmHeight * baseFontSizePx;

    // Rounded to the nearest rhythm line
    let roundedHeightPx = roundToMultiple(desiredHeightPx, rhythmHeightPx);

    // Disallow line heights below the cap height
    if (roundedHeightPx < capHeightPx) {
      roundedHeightPx = roundToMultiple(capHeightPx, rhythmHeightPx, 'up');
    }

    // convert back to a value relative to the font size rem
    return roundedHeightPx / baseFontSizePx;
  }

  return {
    theme: {
      rhythm: {
        baseFontSize,
        defaultLineHeight,
        rhythmHeight,
        capHeights,
      },
      setFontWithRhythm(fontName, fontSizeRem, desiredLineHeight = defaultLineHeight, outputType = 'string') {
        const lineHeight = rhythmLineHeight(fontName, fontSizeRem, desiredLineHeight);
        const shift = rhythmShift(fontName, lineHeight, fontSizeRem * baseFontSize);

        if (outputType === 'object') {
          return {
            fontFamily: fontName,
            fontSize: `${fontSizeRem}rem`,
            paddingTop: `${shift}rem`,
            marginBottom: `-${shift}rem`,
            lineHeight: `${lineHeight}rem`
          };
        } else {
          return `
            font-family: ${fontName};
            font-size: ${fontSizeRem}rem;
            padding-top: ${shift}rem;
            margin-bottom: -${shift}rem;
            line-height: ${lineHeight}rem;
          `;
        }
      },

      rhythmSizing(multiple) {
        return rhythmHeight * multiple;
      },
    },
    global(outputType = 'string') {
      return outputType === 'object' ? {
        ...(debug && {
          html: {
            background: 'linear-gradient(rgba(255, 0, 0, 0.15), rgba(255, 0, 0, 0.15) 1px, transparent 1px)',
            backgroundSize: `1px ${rhythmHeight}rem`,
          }
        }),

        /* Specify our global font size */
        body: {
          fontSize: `${baseFontSize * 100}%`,
        }
      } : `
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
    },
  };
}
