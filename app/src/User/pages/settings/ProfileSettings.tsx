import React, { FormEvent, useMemo, useRef, useState } from 'react';
import JAvatar from 'src/Lib/JAvatar';
import JButton from 'src/Lib/JButton';
import JContainer from 'src/Lib/JContainer';
import JInput from 'src/Lib/JInput';
import { useUserStore } from 'src/User/store/useUserStore';
import { useAlert } from 'src/Lib/store/alerts';
import { updateUserById } from 'src/User/services/users';
import { UpdateUserData } from 'src/utils/types';
import { useNavigate } from 'react-router-dom';
import { useLoader } from 'src/Shared/store/loader';
import { compressImage, diffMatcher, getFileUrl, getUserInitials } from 'src/utils/helpers';
import { uploadImage } from 'src/Shared/services/cdn';

interface Props {}

const ProfileSettings: React.FC<Props> = () => {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((s) => s.setUser);
  const setAlert = useAlert((state) => state.setAlert);
  const setLoader = useLoader((s) => s.setLoader);
  const navigate = useNavigate();

  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const [userDetails, setUserDetails] = useState<UpdateUserData>({
    name: user.name,
    email: user.email,
    bio: user.bio,
    image: user.image,
    username: user.username,
  });

  const userImage = useMemo(() => {
    if (!!uploadFile && uploadFile instanceof File) return URL.createObjectURL(uploadFile);

    if (!!user.image) return getFileUrl(user.image);

    return '';
  }, [user.image, uploadFile]);

  function selectFile() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.multiple = false;
    fileInput.click();

    fileInput.addEventListener('change', () => {
      if (!fileInput.files) return;
      revokeObjectURL();

      setUploadFile(fileInput.files[0]);
    });
  }

  function revokeObjectURL() {
    if (uploadFile instanceof File) {
      URL.revokeObjectURL(userImage);
    }
  }

  async function uploadProfileImage() {
    if (!uploadFile) return;

    try {
      const formData = new FormData();
      formData.append('file', await compressImage(uploadFile));

      const {
        data: {
          data: { key: image },
        },
      } = await uploadImage(formData, user.id);

      revokeObjectURL();

      setUploadFile(null);

      return image;
    } catch (error) {
      throw 'Unable to upload profile picture.';
    }
  }

  const updateUserDetails = async (e: FormEvent) => {
    e.preventDefault();

    let diffData = diffMatcher(user, userDetails);

    try {
      setLoader(true);

      const image = await uploadProfileImage();

      diffData = { ...diffData, image };

      if (!Object.keys(diffData).length) return;

      const {
        data: { data: userFromResponse },
      } = await updateUserById(user.id, diffData);

      setUser({ ...userFromResponse });
      setAlert({ type: 'success', message: 'Updated successfully' });

      navigate('/');
    } catch (error) {
      setAlert({ type: 'danger', message: 'Unable to update user' });
    } finally {
      setLoader(false);
    }
  };
  return (
    <div>
      <div className="text-2xl">profile settings</div>
      <hr className="my-2 border-lime-400" />

      <form className="flex flex-col space-y-4" onSubmit={updateUserDetails}>
        <div className="flex flex-col items-center justify-center">
          <div className="py-2">
            <JAvatar
              src={userImage}
              content={getUserInitials(user)}
              contentClass={`bg-lime-200`}
              size="150px"
              rounded
              iconSize="50px"
            />
          </div>

          <JButton icon="ion:camera-outline" onClick={selectFile} sm round size="20px" />
        </div>

        <JContainer className="flex flex-col space-y-4 rounded-lg py-5">
          <JInput
            label="name"
            id="name"
            value={userDetails.name}
            onInput={(name) => setUserDetails((u) => ({ ...u, name }))}
            type="text"
          />

          <JInput
            label="username"
            id="username"
            value={userDetails.username}
            onInput={(username) => setUserDetails((u) => ({ ...u, username }))}
            type="text"
          />

          {/* //TODO: will be a different component */}
          <JInput
            label="Email"
            id="email"
            value={userDetails.email}
            onInput={(email) => setUserDetails((u) => ({ ...u, email }))}
            type="email"
          />

          <JInput
            label="bio"
            id="bio"
            value={userDetails.bio}
            onInput={(bio) => setUserDetails((u) => ({ ...u, bio }))}
            is="textarea"
          />

          <div className="flex justify-end">
            <JButton type="submit" label="save" />
          </div>
        </JContainer>
      </form>
    </div>
  );
};

export default ProfileSettings;
