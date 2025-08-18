'use client';

import { useRef, useState } from 'react';
import { SquarePen } from 'lucide-react';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import defaultImg from '@/assets/images/user.png'; // fallback default
import EditProfile from './edit-profile';
import ChangePassword from './change-password';

const Profile = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string>(defaultImg.src);

  const handleIconClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    }
  };

  return (
    <div className="bg-white">
      {/* ----- Change Profile Picture ----- */}
      <div className="w-full bg-sc-primary flex items-center justify-center gap-4 py-12 bg-gradient-to-t to-green-800 from-green-500/70">
        <div className="w-32 h-32 rounded-full overflow-hidden relative border border-sc-white group">
          <Image
            src={previewImage}
            alt="Profile Preview"
            width={128}
            height={128}
            className="w-32 h-32 rounded-full object-cover"
          />

          {/* Hidden File Input */}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          {/* Pencil Icon */}
          <div
            className="absolute bottom-2 right-2 bg-sc-white p-2 rounded-full cursor-pointer shadow hover:scale-105 transition"
            onClick={handleIconClick}
          >
            <SquarePen className="w-5 h-5 text-sc-charcoal-logic bg-white" />
          </div>
        </div>

        <div className="text-white">
          <h2 className="text-2xl font-semibold text-sc-white">John Doe</h2>
          <p className="text-sm text-sc-white">Admin</p>
        </div>
      </div>

      <div className="">
        <Tabs defaultValue="editProfile" className="mt-6">
          <div className="flex items-center justify-center">
            <TabsList className="flex flex-wrap space-x-3 bg-transparent">
              {[
                { value: 'editProfile', label: 'Edit Profile' },
                { value: 'changePass', label: 'Change Password' },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="
            font-medium cursor-pointer px-4 py-2 rounded-md
            text-gray-700 dark:text-gray-300
            transition-colors

            data-[state=active]:bg-[#165940] 
            data-[state=active]:text-white
            hover:bg-gray-100 dark:hover:bg-gray-800
          "
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="editProfile">
            <EditProfile />
          </TabsContent>

          <TabsContent value="changePass">
            <ChangePassword />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
