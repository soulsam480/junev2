import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { classNames } from 'src/utils/helpers';
import AppInputTrigger from './InputTrigger';
import { Result } from 'src/utils/types';
import { useDebounceCallback } from 'src/utils/hooks';
import { SearchUserResponse, searchUserWithFilters } from 'src/User/services/users';
import JButton from 'src/Lib/JButton';

interface Props {
  className?: string;
  value: string;
  setValue(val: string): void;
  placeholder?: string;
  onPost: () => void;
  isLoading: boolean;
}

const AppPostEditor: React.FC<Props> = ({
  className,
  value,
  setValue,
  onPost,
  isLoading,
  ...rest
}) => {
  const [isSuggestor, setSuggestor] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchUserResponse[]>([]);
  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    selection: number;
  }>({
    top: null as any,
    left: null as any,
    selection: null as any,
  });
  const [keySelection, setKeySelection] = useState<number>(null as any);
  const [searchQuery, setSearchQuery] = useState('');
  const endTrigger = useRef<() => void | undefined>();
  const timeout = useRef<number>();

  function toggleSuggestor(metaInformation: Result) {
    const { hookType, cursor } = metaInformation;

    if (hookType === 'start') {
      setCoords({
        left: cursor.left,
        top: cursor.top + 10,
        selection: cursor.selectionStart,
      });

      setSuggestor(true);
      setSuggestions([]);
    }

    if (hookType === 'cancel') {
      resetSuggestor();
    }
  }

  function resetSuggestor() {
    setSuggestor(false);

    setSearchQuery('');
    setSuggestions([]);
    setKeySelection(null as any);

    timeout.current = setTimeout(() => {
      setCoords({
        left: null as any,
        top: null as any,
        selection: null as any,
      });
    }, 110);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (!isSuggestor) return;
    const { which } = event;

    if (which === 40) {
      event.preventDefault();

      setKeySelection((keySelection + 1) % suggestions.length);
    }

    if (which === 38) {
      event.preventDefault();

      setKeySelection(keySelection > 0 ? keySelection - 1 : suggestions.length - 1);
    }

    if (which === 13) {
      event.preventDefault();
      insertUser(keySelection);
    }

    if (which === 27) {
      event.preventDefault();

      resetSuggestor();

      if (!!endTrigger.current) {
        endTrigger.current();
      }
    }
  }

  function insertUser(idx: number) {
    const { selection } = coords;
    const user = suggestions[idx];

    const newText = `${value.slice(0, selection - 1)}@${user.username}${value.slice(
      selection + user.username.length,
      value.length,
    )}`;

    setValue(newText);

    resetSuggestor();

    if (!!endTrigger.current) {
      endTrigger.current();
    }
  }

  async function findUserByUsername() {
    if (!searchQuery) return setSuggestions([]);

    try {
      const {
        data: { data },
      } = await searchUserWithFilters({ username: searchQuery, limit: 5 });

      setSuggestions([...data]);
    } catch (error) {
      console.log(error);
    }
  }

  const handleCtrlEnter = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const { which, ctrlKey } = e;
      if (which === 13 && ctrlKey) {
        e.preventDefault();
        onPost();
      }
    },
    [onPost],
  );

  const debounced = useDebounceCallback(findUserByUsername, 500);

  useEffect(() => {
    debounced();
  }, [searchQuery]);

  useEffect(() => {
    () => clearTimeout(timeout.current);
  }, [timeout.current]);

  return (
    <div className="j-rich" onKeyDown={handleKeyDown}>
      <AppInputTrigger
        trigger={{
          keyCode: 50,
          shiftKey: true,
        }}
        onStart={toggleSuggestor}
        onCancel={toggleSuggestor}
        onType={(meta) => setSearchQuery(meta.text || '')}
        endTrigger={(trigger) => (endTrigger.current = trigger)}
      >
        <textarea
          className={classNames([className || '', 'j-rich__editor'])}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyUp={handleCtrlEnter}
          {...rest}
        ></textarea>
      </AppInputTrigger>
      <EditorToolbar onPost={onPost} disabled={!value || isLoading} isLoading={isLoading} />
      <div className="j-menu z-1000">
        <CSSTransition
          in={isSuggestor}
          timeout={{
            enter: 100,
            exit: 100,
          }}
          classNames="j-menu"
          unmountOnExit
        >
          <div
            className={classNames(['j-menu__list__parent origin-top-right'])}
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
                    onClick={() => insertUser(idx)}
                  >
                    {el.username}
                  </div>
                ))
              ) : (
                <div className="j-menu__list-item !cursor-default">search an user</div>
              )}
            </div>
          </div>
        </CSSTransition>
      </div>
    </div>
  );
};

interface EditorToolbarProps {
  onPost: () => void;
  disabled?: boolean;
  isLoading: boolean;
}

function EditorToolbar({ onPost, disabled, isLoading }: EditorToolbarProps) {
  return (
    <div className="j-rich__toolbar">
      <JButton icon="ion:file-tray-outline" size="16px" sm invert title="Upload image" />
      <JButton
        label="Post"
        sm
        invert
        title="Create post"
        onClick={onPost}
        disabled={disabled}
        loading={isLoading}
      />
    </div>
  );
}

export default AppPostEditor;
