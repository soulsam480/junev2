import React, { useRef, useState } from 'react';
import JAvatar from 'src/Lib/JAvatar';
import JButton from 'src/Lib/JButton';
import JImage from 'src/Lib/JImage';
import JInput from 'src/Lib/JInput';
import { useUserStore } from '../store/useUserStore';

interface Props { }
interface UserDetails {
    name: string;
    email: string;
    bio?: string;
    image?: string;
    password: string;
}

const Settings: React.FC<Props> = () => {
    const { user } = useUserStore();
    const inputFile = useRef<HTMLInputElement>(null);
    const [userDetails, setUserDetails] = useState<UserDetails>({
        name: user.name,
        email: user.email,
        bio: user.bio,
        image: user.image,
        password: ""
    })

    const updateUserDetails = (e) => {
e.prev
    }
    return (<>
        <h1 className="text-center mb-4 font-bold text-2xl">User Settings</h1>
        <form className="flex flex-col space-y-8" onSubmit={updateUserDetails}>
            <span className="flex flex-col items-center justify-center ">
                <JAvatar src="https://cdn.quasar.dev/img/boy-avatar.png" size="150px" rounded />
                <JButton noBg icon="ion:camera-outline" size="25px"
                    onClick={() => {
                        inputFile.current?.click()
                    }} />
                <input type='file' id='file' ref={inputFile} style={{ display: 'none' }} />
            </span>
            <span className="relative">
                <label htmlFor="name" className="absolute left-3 -top-3 bg-green-200 px-1">Name</label>
                <JInput id="name" value={userDetails.name} onInput={(name) => setUserDetails({ ...userDetails, name })} type="text"
                    className="border-2 border-green-500" is="input" />
            </span>

            <span className="relative">
                <label htmlFor="email" className="absolute left-3 -top-3 bg-green-200 px-1">Email</label>
                <JInput id="email" value={userDetails.email} onInput={(email) => setUserDetails({ ...userDetails, email })} type="text"
                    className="border-2 border-green-500" is="input" />
            </span>

            <span className="relative">
                <label htmlFor="bio" className="absolute left-3 -top-3 bg-green-200 px-1">Bio</label>
                <JInput id="bio" value={userDetails.bio} onInput={(bio) => setUserDetails({ ...userDetails, bio })} type="text"
                    className="border-2 border-green-500" is="textarea" />
            </span>

            <span className="relative">
                <label htmlFor="password" className="absolute left-3 -top-3 bg-green-200 px-1">Password</label>
                <JInput id="password" value={userDetails.password} onInput={(password) => setUserDetails({ ...userDetails, password })} type="password"
                    className="border-2 border-green-500" is="input" />
            </span>
            <JButton type="submit">Update</JButton>
        </form>
    </>

    );
};
export default Settings;