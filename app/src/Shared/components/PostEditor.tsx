import React, { useCallback } from 'react';
import { classNames } from 'src/utils/helpers';
import { useDebounceCallback } from 'src/utils/hooks';
import { searchUserWithFilters } from 'src/User/services/users';
import JButton from 'src/Lib/JButton';
import { Mention, MentionsInput, SuggestionDataItem } from 'react-mentions';

interface Props {
  className?: string;
  value: string;
  setValue(val: string): void;
  placeholder?: string;
  onPost: () => void;
  isLoading: boolean;
}

const AppPostEditor: React.FC<Props> = ({ className, value, setValue, onPost, isLoading }) => {
  async function findUserByUsername(query: string, callback: (data: SuggestionDataItem[]) => void) {
    if (!query) return callback([]);

    try {
      const {
        data: { data },
      } = await searchUserWithFilters({ username: query, limit: 5 });

      return callback(data.map((el) => ({ display: el.username, id: el.id })));
    } catch (error) {
      console.log(error);
    }
  }

  const handleCtrlEnter = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      if (!value) return;
      const { key, ctrlKey } = e;

      if (key === 'Enter' && ctrlKey) {
        e.preventDefault();
        onPost();
      }
    },
    [onPost],
  );

  const debounced = useDebounceCallback(findUserByUsername, 300);
  return (
    <div className="j-rich">
      <MentionsInput
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={classNames(['j-rich__editor'])}
        style={{
          '&multiLine': {
            input: undefined,
          },
        }}
        onKeyDown={handleCtrlEnter}
      >
        <Mention
          displayTransform={(_, name) => `@${name}`}
          trigger="@"
          data={debounced}
          markup="@__display__ "
        />
      </MentionsInput>
      <EditorToolbar onPost={onPost} disabled={!value || isLoading} isLoading={isLoading} />
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
