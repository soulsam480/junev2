import React, { useCallback, useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { classNames } from 'src/utils/helpers';
import AppInputTrigger from './AppInputTrigger';
import { Result } from 'src/utils/types';
import { useDebounce } from 'src/utils/hooks';
import { SearchUserResponse, searchUserWithFilters } from 'src/User/services/users';

interface Props {
  className?: string;
}

const AppPostEditor: React.FC<Props> = ({ className }) => {
  const [isSuggestor, setSuggestor] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchUserResponse[]>([]);
  const [coords, setCoords] = useState({
    top: 0,
    left: 0,
  });
  const [keySelection, setKeySelection] = useState(0);

  const [searchQuery, setSearchQuery] = useState('');

  function toggleSuggestor(metaInformation: Result) {
    const { hookType, cursor } = metaInformation;

    if (hookType === 'start') {
      setSuggestor(true);
      setCoords({
        left: cursor.left,
        top: cursor.top + 10,
      });
    }
    if (hookType === 'cancel') {
      resetSuggestor();
    }
  }

  function resetSuggestor() {
    setSuggestor(false);
    setCoords({
      left: 0,
      top: 0,
    });
    setSearchQuery('');
    setSuggestions([]);
  }

  const handleInput = useCallback(
    (meta: Result) => {
      setSearchQuery(meta.text || '');
    },
    [searchQuery],
  );

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const { which } = event;

    if (which === 40) {
      // 40 is the character code of the down arrow
      event.preventDefault();

      setKeySelection((keySelection + 1) % suggestions.length);
    }
  }

  function handleKeyUp(event: React.KeyboardEvent<HTMLDivElement>) {
    const { which } = event;

    if (which === 38) {
      // 40 is the character code of the down arrow
      event.preventDefault();

      setKeySelection((keySelection - 1) % suggestions.length);
    }
  }

  async function findUserByUsername() {
    try {
      const {
        data: { data },
      } = await searchUserWithFilters({ username: searchQuery });

      setSuggestions([...data]);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    findUserByUsername();
  }, [searchQuery]);

  return (
    <div className="relative w-full h-full" onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}>
      <AppInputTrigger
        trigger={{
          keyCode: 50,
          shiftKey: true,
        }}
        onStart={toggleSuggestor}
        onCancel={toggleSuggestor}
        onType={useDebounce(handleInput, 500)}
      >
        <textarea className={classNames([className || '', 'j-rich'])}></textarea>
      </AppInputTrigger>

      <div className="j-menu z-1000">
        <CSSTransition
          in={isSuggestor}
          timeout={{
            enter: 300,
            exit: 300,
          }}
          classNames="j-menu"
          unmountOnExit
        >
          <div
            className={classNames(['j-menu__list__parent origin-top-left'])}
            style={{
              top: coords.top,
              left: coords.left,
            }}
          >
            <div
              tab-index="-1"
              role="listbox"
              aria-labelledby="assigned-to-label"
              className={classNames(['j-menu__list'])}
            >
              {!!suggestions.length ? (
                suggestions.map((el, idx) => (
                  <div
                    key={el.id}
                    className={classNames([
                      'j-menu__list-item',
                      { 'bg-lime-300': idx === keySelection },
                    ])}
                  >
                    {el.username}
                  </div>
                ))
              ) : (
                <div className="j-menu__list-item">search an user</div>
              )}
            </div>
          </div>
        </CSSTransition>
      </div>
    </div>
  );
};

export default AppPostEditor;
