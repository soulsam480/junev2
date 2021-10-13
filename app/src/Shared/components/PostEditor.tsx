import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { classNames } from 'src/utils/helpers';
import { useDebounceCallback } from 'src/utils/hooks';
import { searchUserWithFilters } from 'src/User/services/users';
import JButton from 'src/Lib/JButton';
import { Mention, MentionsInput, SuggestionDataItem } from 'react-mentions';
import JAvatar from 'src/Lib/JAvatar';
import JIcon from 'src/Lib/JIcon';
import { Post } from 'src/utils/types';

interface Props {
  className?: string;
  value: string;
  setValue(content: string): void;
  placeholder?: string;
  onPost: (files: File[] | null) => void;
  isLoading: boolean;
  post?: Post;
}

interface PostAPI {
  selectFile(): void;
  removeFileFromAray(file: { url: string; name: string }): void;
  isLoading: boolean;
  imageUrls: { url: string; name: string }[];
  post?: Post;
}

const EditorContext = createContext<PostAPI>(null as any);

const useEditorContext = () => useContext(EditorContext);

const AppPostEditor: React.FC<Props> = ({ value, setValue, onPost, isLoading, post }) => {
  const [files, setFiles] = useState<File[]>([]);

  function selectFile() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.multiple = true;
    fileInput.click();

    fileInput.addEventListener('change', () => {
      if (!fileInput.files) return;

      let filesFromInput = Array.from(!!fileInput.files ? fileInput.files : []);

      filesFromInput = filesFromInput.length > 6 ? filesFromInput.slice(0, 5) : filesFromInput;

      setFiles((o) => [...filesFromInput].concat(!!o.length ? [...o] : []));
    });
  }

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

  const imageUrls = useMemo(() => {
    return files && files.map((file) => ({ url: URL.createObjectURL(file), name: file.name }));
  }, [files]);

  function removeFileFromAray(file: { url: string; name: string }) {
    URL.revokeObjectURL(file.url);
    setFiles((o) => (!o.length ? [] : o.filter((f) => f.name !== file.name)));
  }

  async function submitPost(files: File[]) {
    onPost(files);

    imageUrls.forEach((file) => URL.revokeObjectURL(file.url));
    setFiles([]);
  }

  const handleCtrlEnter = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      if (!value) return;

      const { key, ctrlKey } = e;

      if (key === 'Enter' && ctrlKey) {
        e.preventDefault();

        submitPost(files);
      }
    },
    [submitPost],
  );

  const debounced = useDebounceCallback(findUserByUsername, 300);
  return (
    <EditorContext.Provider value={{ selectFile, isLoading, imageUrls, removeFileFromAray, post }}>
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

        <EditorToolbar disabled={!value || isLoading} onPost={() => submitPost(files)} />
      </div>
    </EditorContext.Provider>
  );
};

interface EditorToolbarProps {
  disabled?: boolean;
  onPost: () => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({ disabled, onPost }) => {
  const { selectFile, imageUrls, isLoading, removeFileFromAray } = useEditorContext();

  return (
    <div className="j-rich__toolbar">
      <div className="flex items-center space-x-3">
        {!!imageUrls && imageUrls?.length
          ? imageUrls.map((file) => (
              <div className="relative" key={file.name}>
                <span
                  className="absolute -top-2 -right-2 z-100 cursor-pointer"
                  onClick={() => removeFileFromAray(file)}
                >
                  <JIcon
                    icon="ion:close-circle"
                    size="18px"
                    className="text-red-700 bg-white rounded-full"
                  />
                </span>

                <JAvatar src={file.url} key={file.name} size="32px" contentClass="rounded-md" />
              </div>
            ))
          : null}
      </div>{' '}
      <div className="flex items-center space-x-1">
        <JButton icon="ion:image" size="16px" sm invert title="Upload image" onClick={selectFile} />
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
    </div>
  );
};

export default AppPostEditor;
