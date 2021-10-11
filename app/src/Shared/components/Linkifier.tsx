import React, { useCallback, useMemo } from 'react';
import autolinker from 'autolinker';

const IMAGE_REGEXP = new RegExp(/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png|svg|jpeg)/, 'g');

interface Props {
  children: string;
  linkEl: (args: { match: string; key: number; href: string; isImage: boolean }) => React.ReactNode;
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

    let elements = [];
    const images: any[] = [];
    let lastIndex = 0;

    matches.forEach((match, index) => {
      if (match.getOffset() > lastIndex) {
        elements.push(text.substring(lastIndex, match.getOffset()));
      }

      if (IMAGE_REGEXP.test(match.getMatchedText())) {
        images.push(
          linkEl({
            match: match.getMatchedText(),
            key: index,
            href: match.getMatchedText(),
            isImage: true,
          }),
        );

        return (lastIndex = match.getOffset() + match.getMatchedText().length);
      }

      // Push Link component
      elements.push(
        linkEl({
          match: match.getMatchedText(),
          key: index,
          href: match.getMatchedText(),
          isImage: false,
        }),
      );

      lastIndex = match.getOffset() + match.getMatchedText().length;
    });

    // Push remaining text
    if (text.length > lastIndex) {
      elements.push(text.substring(lastIndex));
    }

    elements = elements.concat(images);

    return elements;
  }, [text]);

  return <div className="break-all">{parse()}</div>;
};

export default AppLinkifier;
