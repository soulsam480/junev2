import React, { useCallback, useMemo } from 'react';
import autolinker from 'autolinker';

interface Props {
  children: string;
  linkEl: (args: { match: string; key: number; href?: string }) => React.ReactNode;
}

const AppLinkifier: React.FC<Props> = ({ children, linkEl }) => {
  const text = children;
  const linker = useMemo(
    () =>
      new autolinker({
        urls: true,
        mention: 'instagram',
      }),
    [],
  );

  const parse = useCallback(() => {
    const matches = linker.parse(text);
    if (matches.length === 0) return text;

    const elements = [];
    let lastIndex = 0;

    matches.forEach((match, index) => {
      // Push text located before matched string
      if (match.getOffset() > lastIndex) {
        elements.push(text.substring(lastIndex, match.getOffset()));
      }

      // Push Link component
      elements.push(
        linkEl({
          match: match.getMatchedText(),
          key: index,
          href:
            match.getType() === 'mention'
              ? `/user/${match.getMatchedText()}`
              : match.getMatchedText(),
        }),
      );

      lastIndex = match.getOffset() + match.getMatchedText().length;
    });

    // Push remaining text
    if (text.length > lastIndex) {
      elements.push(text.substring(lastIndex));
    }

    return elements.length === 1 ? elements[0] : elements;
  }, [text]);

  const parsedText = useMemo(() => parse(), [parse]);

  return <div className="break-all">{parsedText}</div>;
};

export default AppLinkifier;
