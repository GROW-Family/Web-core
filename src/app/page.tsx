import Button from "@/components/common/Button";
import ImageViewer from "@/components/common/ImageViewer";
import Input from "@/components/common/Input";
import { colors, colorStyle } from "@/styles/theme";

import tesst from '@static/images/404_tip.png';

export default function Home() {
  return (
    <div className="grid grid-rows-[10px_1fr_10px] items-center justify-items-center pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Button color='white' text="Gửi" variant="black" />
      <ImageViewer src={tesst} size={400} isObectFit />
      <Input
        label="Tên"
        placeholder="Nhập tên của bạn" />
    </div>
  );
}
