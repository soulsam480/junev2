import React, { useCallback, useMemo } from 'react';
import autolinker from 'autolinker';

// const IMAGE_REGEXP = new RegExp(/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png|svg|jpeg)/, 'g');

interface Props {
  children: string;
  linkEl: (args: { match: string; key: number; href: string }) => React.ReactNode;
}

const AppLinkifier: React.FC<Props> = ({ children, linkEl }) => {
  const linker = useMemo(
    () =>
      new autolinker({
        urls: true,
        mention: 'instagram',
        sanitizeHtml: true,
      }),
    [],
  );

  const parse = useCallback(() => {
    const matches = linker.parse(children);
    if (matches.length === 0) return children;

    let elements = [];
    let lastIndex = 0;

    matches.forEach((match, index) => {
      if (match.getOffset() > lastIndex) {
        elements.push(children.substring(lastIndex, match.getOffset()));
      }

      // Push Link component
      elements.push(
        linkEl({
          match: match.getMatchedText(),
          href: match.getMatchedText(),
          key: index,
        }),
      );

      lastIndex = match.getOffset() + match.getMatchedText().length;
    });

    // Push remaining text
    if (children.length > lastIndex) {
      elements.push(children.substring(lastIndex));
    }

    elements = elements;

    return elements;
  }, [children, linkEl]);

  return <div className="break-all">{parse()}</div>;
};

export default AppLinkifier;
