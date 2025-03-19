"use client";

import Avatar from "@/components/common/Avatar";
import Button from "@/components/common/Button";
import Checkbox from "@/components/common/Checkbox";
import ImageViewer from "@/components/common/ImageViewer";
import Input from "@/components/common/Input";
import Line from "@/components/common/Line";

import tesst from '@static/images/404_tip.png';
import avatar from '@static/images/avatar.svg';
import { useState } from "react";

export default function Home() {
  const [isChecked, setIsChecked] = useState<boolean>(false);
  return (
    <div className="grid grid-rows-[10px_1fr_10px] items-center justify-items-center pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Button color='white' text="Gửi" variant="black" tooltip={{ title: 'tesst', placement: 'bottom' }} />
      <ImageViewer src={tesst} size={400} isObectFit />
      <Input
        label="Tên"
        placeholder="Nhập tên của bạn" />
      <Avatar src={avatar} />
      <Line />
      <Checkbox label="test" checked={isChecked} onChange={() => setIsChecked(!isChecked)}/>
    </div>
  );
}
